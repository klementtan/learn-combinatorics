import {
  Tag,
  Button,
  Form,
  InputNumber,
  Radio,
  Input,
  Row,
  Col,
  Tooltip,
  Typography,
  Modal,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { parseKatex } from '@/utils/Katex';
import { createAttemptSubmission, updateAttemptTime } from '@/services/attempt';
import { connect } from 'umi';
import * as moment from 'moment';

const parseFraction = (numerator, denominator) => {
  var res = String.raw`$\frac{`;
  res += numerator;
  res += String.raw`}{`;
  res += denominator;
  res += String.raw`}$`;
  return res;
};

const AnswerSubmissionModal = props => {
  const [state, setState] = useState({
    visible: false,
    confirmLoading: false,
    status: null,
    submission_value_numerator: props.submission.submission_value_numerator,
    submission_value_denominator: props.submission.submission_value_denominator,
  });
  const [startTime, setTime] = useState(moment.now());
  const { attempt } = props;
  useEffect(() => {
    return () => {
      const time = (moment.now() - startTime) / 1000;
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'attempt/clear',
        });
      }
      updateAttemptTime(props.attempt.id, { attempt_time: time });
    };
  }, []);

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const handleOk = async () => {
    setState({
      ...state,
      confirmLoading: true,
    });

    await createAttemptSubmission(attempt.id, props.submission)
      .then(async response => {
        setState({
          ...state,
          status: response.submission.status,
          confirmLoading: false,
        });
        const { dispatch } = props;
        if (dispatch) {
          await dispatch({
            type: 'attempt/fetch',
            payload: attempt.problem.id,
          });
        }
      })
      .catch(error => {
        setState({
          ...state,
          confirmLoading: false,
        });
      });
  };

  const handleCancel = () => {
    setState({
      ...state,
      visible: false,
      status: null,
    });
  };

  const { submission } = props.submission;
  const { visible, confirmLoading } = state;
  return (
    <>
      <Tooltip title={['pass', 'skipped'].includes(attempt.status) && 'Answer has been unlocked'}>
        <Button type="primary" onClick={showModal}>
          Submit
        </Button>
      </Tooltip>

      <Modal
        title="Answer"
        visible={visible}
        onOk={handleOk}
        okText={'Submit'}
        okButtonProps={{ disabled: state.status }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {state.status === null ? (
          <div>
            <Typography.Paragraph>
              <Typography.Text strong>Fraction:</Typography.Text>{' '}
              {parseKatex(
                parseFraction(
                  submission.submission_value_numerator,
                  submission.submission_value_denominator,
                ),
              )}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <Typography.Text strong>Decimal:</Typography.Text>{' '}
              {submission.submission_value_numerator / submission.submission_value_denominator}
            </Typography.Paragraph>
          </div>
        ) : (
          <Typography.Paragraph>
            <Typography.Text strong>Status: </Typography.Text>
            {
              {
                pass: <Tag color={'green'}>Pass</Tag>,
                fail: <Tag color={'red'}>Fail</Tag>,
              }[state.status]
            }
          </Typography.Paragraph>
        )}
      </Modal>
    </>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(AnswerSubmissionModal);
