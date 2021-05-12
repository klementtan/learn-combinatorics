import {
  Button,
  Form,
  Tag,
  Input,
  Checkbox,
  Table,
  Typography,
  List,
  Select,
  Row,
  Col,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningFilled,
} from '@ant-design/icons';
import {
  createAnswer,
  createHint,
  updateHint,
  upsertHintVideo,
  upsertHintPdf,
} from '@/services/hints';

import { connect, history, useLocation, Redirect } from 'umi';
import qs from 'qs';
import HintCreate from '@/pages/Admin/Hints/components/HintCreate';
import { ACCESS_LEVELS } from '@/components/Users/UsersAccessLevel';
import HintPdf from '@/pages/Admin/Hints/components/HintPdf';
import Divider from 'antd/es/divider';
import { getHint } from '@/services/hints';
import { isValidFile } from '@/utils/utils';
import HintVideo from '@/pages/Admin/Hints/components/HintVideo';

const HintDetailsContainer = props => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationError] = useState([]);
  const [prevPrams, setPrevParams] = useState({});
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  const [hints, setHints] = useState([]);
  const [prevHint, setPrevHint] = useState({});
  const [hint, setHint] = useState({
    problem_id: null,
    hint: {
      difficulty: 1,
      title: null,
      body: '',
      privilege_level: ACCESS_LEVELS.PUBLIC_USER,
    },
  });
  const [hintPdf, setHintPdf] = useState({});
  const [hintVideo, setHintVideo] = useState({});
  const onSelectHint = hintId => {
    return history.push(`/admin/hints?hint_id=${hintId}&active_tab=2`);
  };
  function loadHint() {
    if (params.hint_id) {
      getHint(params.hint_id).then(resp => {
        const hintResp = resp.hint;
        const problemResp = hintResp.problem;
        setPrevHint(hintResp);
        setHint({
          problem_id: problemResp.id,
          hint: {
            difficulty: hintResp.difficulty,
            title: hintResp.title,
            body: hintResp.body,
            privilege_level: hintResp.privilege_level,
          },
        });

        if (hintResp.hint_video_url) {
          setHintVideo(hintResp.hint_video_url);
        }
        if (hintResp.hint_body_pdf_url) {
          setHintPdf(hintResp.hint_body_pdf_url);
        }
      });
    }
  }

  useEffect(() => {
    if (JSON.stringify(params) !== JSON.stringify(prevPrams)) {
      setPrevParams(params);
    } else {
      return;
    }
    loadHint();
  }, [params]);
  const validate = () => {
    let currValidationError = [];
    if (!hint.problem_id) {
      currValidationError.push('Choose the problem that the hint belongs to.');
    }
    if (!hint.hint.title) {
      currValidationError.push('Enter title');
    }

    if (!(hint.hint.body || isValidFile(hintPdf) || isValidFile(hintVideo))) {
      currValidationError.push('Enter at least "Hint Body", "Hint body pdf file" or "Hint Video" ');
    }

    return currValidationError;
  };

  useEffect(() => {
    setValidationError(validate());
  }, [hint, hintPdf, hintVideo]);

  const onFinish = async problemPayload => {
    setErrorMessage('');
    setSuccess(false);
    setLoading(true);
    updateHint(params.hint_id, hint)
      .then(async hintResp => {
        const createdHint = hintResp.hint;
        const hintId = createdHint.id;

        if (hintPdf instanceof File) {
          await upsertHintPdf(hintId, hintPdf);
        }
        if (hintVideo instanceof File) {
          await upsertHintVideo(hintId, hintVideo);
        }

        setSuccess(true);
        loadHint();
        await dispatch({
          type: 'hints/fetch',
        });
      })
      .catch(err => {
        setErrorMessage(err.error);
      })
      .finally(async () => {
        const { dispatch } = props;
        if (dispatch) {
          await dispatch({
            type: 'problems/fetch',
          });
          await dispatch({
            type: 'hints/fetch',
          });
        }
        setLoading(false);
      });
  };

  return (
    <>
      <Row justify={'center'}>
        <div style={{ width: '75%', marginBottom: '1em' }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select Hint"
            optionFilterProp="children"
            onSelect={onSelectHint}
            value={prevHint?.id ? `${prevHint.id}.  ${prevHint.title}` : null}
          >
            {props.hints.map((currHint, idx) => {
              return (
                <Select.Option key={idx} value={currHint.id}>
                  {currHint.id}. {currHint.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </Row>
      {JSON.stringify(prevHint) !== JSON.stringify({}) && (
        <>
          <HintCreate hint={hint} setHint={setHint} />
          <HintPdf hintPdf={hintPdf} setHintPdf={setHintPdf} />
          <HintVideo hintVideo={hintVideo} setHintVideo={setHintVideo} />
          <Row justify={'center'}>
            <Form
              style={{
                width: '75%',
                marginTop: '1em',
              }}
              name="basic"
              onFinish={onFinish}
            >
              <Form.Item>
                <Row>
                  <Button
                    disabled={validationErrors.length > 0}
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </Row>
              </Form.Item>
              <Form.Item>
                {success && <Tag color={'green'}>Success</Tag>}
                {errorMessage && errorMessage?.length !== 0 && (
                  <Tag color={'orange'}>{errorMessage}</Tag>
                )}
                {validationErrors.map((err, idx) => (
                  <Tag color={'orange'} key={idx} style={{ margin: '0.5em' }}>
                    {err}
                  </Tag>
                ))}
              </Form.Item>
            </Form>
          </Row>
        </>
      )}
    </>
  );
};

export default connect(({ chapters, loading, hints }) => ({
  hints: hints,
  chapters: chapters,
  loading: loading.models.chapters,
}))(HintDetailsContainer);
