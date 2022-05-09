import { Button, Form, Tag, Input, Checkbox, Table, Typography, Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { createHint, upsertHintVideo, upsertHintPdf } from '@/services/hints';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import ProblemDifficulty from '@/components/Problems/ProblemDifficulty';
import { connect, history, Redirect } from 'umi';
import qs from 'qs';
import { createLecture } from '@/services/lecture';
import Select from 'antd/es/select';
import HintCreate from '@/pages/Admin/Hints/components/HintCreate';
import { ACCESS_LEVELS } from '@/components/Users/UsersAccessLevel';
import HintPdf from '@/pages/Admin/Hints/components/HintPdf';
import Divider from 'antd/es/divider';
import HintVideo from '@/pages/Admin/Hints/components/HintVideo';
import ProblemDisplay from '@/components/ProblemAttempt/ProblemDisplay';
import AnswerExplanationPdf from '@/pages/Admin/Problems/components/AnswerExplanationPdf';
import Tooltip from 'antd/es/tooltip';

const HintCreateContainer = props => {
  const { dispatch } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { chapters } = props;
  const [chapter, setChapter] = useState({});
  const [createdId, setCreatedId] = useState(-1);
  const [validationErrors, setValidationError] = useState([]);

  const [hint, setHint] = useState({
    problem_id: null,
    hint: {
      title: null,
      body: '',
    },
  });
  const [hintPdf, setHintPdf] = useState({});
  const [hintVideo, setHintVideo] = useState({});

  const validate = () => {
    let currValidationError = [];
    if (!hint.problem_id) {
      currValidationError.push('Choose the problem that the hint belongs to.');
    }
    if (!hint.hint.title) {
      currValidationError.push('Enter title');
    }

    if (!(hint.hint.body || hintPdf instanceof File || hintVideo instanceof File)) {
      currValidationError.push('Enter at least "Hint Body", "Hint body pdf file", "Hint video" ');
    }

    return currValidationError;
  };

  useEffect(() => {
    setValidationError(validate());
  }, [hint, hintPdf, hintVideo]);

  const onFinish = async lecturePayload => {
    setErrorMessage('');
    setSuccess(false);
    setLoading(true);
    setCreatedId(-1);
    createHint(hint)
      .then(async hintResp => {
        const createdHint = hintResp.hint;
        const hintId = createdHint.id;
        setCreatedId(hintId);
        if (hintPdf instanceof File) {
          await upsertHintPdf(hintId, hintPdf);
        }

        if (hintVideo instanceof File) {
          await upsertHintVideo(hintId, hintVideo);
        }

        setSuccess(true);
      })
      .catch(err => {
        setErrorMessage(err.error);
      })
      .finally(async () => {
        setLoading(false);
        await dispatch({
          type: 'hints/fetch',
        });
      });
  };

  return (
    <>
      <HintCreate hint={hint} setHint={setHint} />
      <HintPdf hintPdf={hintPdf} setHintPdf={setHintPdf} />

      <HintVideo hintVideo={hintVideo} setHintVideo={setHintVideo} />
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
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
                Submit
              </Button>
              {createdId !== -1 && (
                <Button
                  onClick={() => history.push(`/admin/hints?active_tab=2&hint_id=${createdId}`)}
                  style={{ marginLeft: '1em' }}
                >
                  Edit Created Hint
                </Button>
              )}
            </Row>
          </Form.Item>
          <Form.Item>
            {success && <Tag color={'green'}>Success</Tag>}

            {errorMessage?.length !== 0 && <Tag color={'orange'}>{errorMessage}</Tag>}
            {validationErrors.map((err, idx) => (
              <Tag color={'orange'} key={idx} style={{ margin: '0.5em' }}>
                {err}
              </Tag>
            ))}
          </Form.Item>
        </Form>
      </Row>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.problems,
}))(HintCreateContainer);
