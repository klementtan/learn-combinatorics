import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Card, Button, Alert } from 'antd';
import { createDoubtThread } from '@/services/doubt';
import { parseKatex } from '@/utils/Katex';
import { connect } from 'umi';

const DoubtForm = props => {
  const [doubtThread, setDoubtThread] = useState({
    attempt_id: props.attempt.id,
    doubt_thread: {
      title: '',
      body: '',
    },
  });
  const { attempt } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const onSubmit = async () => {
    setLoading(true);
    createDoubtThread(doubtThread)
      .then(async response => {
        const { dispatch } = props;
        if (dispatch) {
          await dispatch({
            type: 'attempt/fetchByAttemptId',
            payload: attempt.id,
          });
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  };

  const [previewMode, setPreviewMode] = useState(false);

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const formChange = e => {
    const key = Object.keys(e)[0];
    if (['title', 'body'].includes(key)) {
      setDoubtThread({
        ...doubtThread,
        doubt_thread: {
          ...doubtThread.doubt_thread,
          ...e,
        },
      });
    }
  };
  return (
    <Card title={'Submit Doubt'}>
      <Form onValuesChange={formChange}>
        <Form.Item name={'title'} label={'Title'}>
          <Input disabled={props.user.id !== props.attempt.user.id} />
        </Form.Item>
        <Form.Item name={'body'} label={'Doubt'}>
          {previewMode ? (
            <Form.Item>
              {' '}
              {doubtThread.doubt_thread.body.split("\n").map(line => parseKatex(line))}
              </Form.Item>
          ) : (
            <Input.TextArea disabled={props.user.id !== props.attempt.user.id} rows={4} />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            style={{
              margin: '1em',
            }}
            onClick={togglePreview}
          >
            Preview
          </Button>
          <Button
            loading={loading}
            type={'primary'}
            onClick={onSubmit}
            style={{
              margin: '1em',
            }}
            disabled={props.user.id !== props.attempt.user.id}
          >
            Submit
          </Button>
        </Form.Item>
        {error.length > 0 && <Alert message={error} type="error" />}
      </Form>
    </Card>
  );
};

export default connect(({ attempt, loading, user }) => ({
  attempt: attempt,
  user: user.currentUser,
  loading: loading.models.attempt,
}))(DoubtForm);
