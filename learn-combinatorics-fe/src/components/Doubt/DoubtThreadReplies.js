import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Card, Button, Alert, Typography, List, Comment } from 'antd';
import { parseKatex } from '@/utils/Katex';
import moment from 'moment';
import { createDoubtReply } from '@/services/doubt';
import { connect } from 'umi';

const DoubtThreadReplies = props => {
  const [replies, setReplies] = useState(null);
  const { attempt } = props;
  const doubtThread = attempt.doubt_thread;
  const [loading, setLoading] = useState(false);

  const [reply, setReply] = useState({
    doubt_thread_id: doubtThread.id,
    doubt_reply: {
      body: '',
    },
  });
  const [previewMode, setPreviewMode] = useState(false);
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  const handleReplyChange = e => {
    setReply({
      ...reply,
      doubt_reply: {
        body: e.target.value,
      },
    });
  };

  useEffect(() => {
    if (doubtThread.doubt_replies !== replies) {
      setReplies(doubtThread.doubt_replies);
    }
  });

  const submitReply = async () => {
    setLoading(true);
    await createDoubtReply(reply).then(async response => {
      setLoading(false);
      const { dispatch } = props;
      if (dispatch) {
        await dispatch({
          type: 'attempt/fetchByAttemptId',
          payload: attempt.id,
        });
      }
      setPreviewMode(false);
      setReply({
        doubt_thread_id: doubtThread.id,
        doubt_reply: {
          body: '',
        },
      });
    });
  };
  moment.locale('en')
  return (
    <Card
      type="inner"
      bordered={false}
      style={{
        marginTop: '2em',
        marginBottom: '1em',
      }}
    >
      <Form>
        <Typography.Title level={4}>Replies</Typography.Title>
        <Form.Item>
          {previewMode ? (
            parseKatex(reply.doubt_reply.body)
          ) : (
            <Input.TextArea value={reply.doubt_reply.body} onChange={handleReplyChange} rows={2} />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            onClick={togglePreview}
            style={{
              margin: '1em',
            }}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={submitReply}
            loading={loading}
            type="primary"
            style={{
              margin: '1em',
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <List
        className="comment-list"
        header={`${replies && replies.length} replies`}
        itemLayout="horizontal"
        dataSource={replies ? replies : []}
        renderItem={reply => (
          <li>
            <Comment
              author={reply.user.name}
              avatar={reply.user.avatar_url}
              content={parseKatex(reply.body)}
              datetime={moment(reply.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            />
          </li>
        )}
      />
    </Card>
  );
};
export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(DoubtThreadReplies);
