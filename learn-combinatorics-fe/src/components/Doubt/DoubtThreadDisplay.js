import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Card, Button, Alert, Typography, Divider, Row, Col } from 'antd';
import { updateDoubtThread } from '@/services/doubt';
import { parseKatex } from '@/utils/Katex';
import DoubtThreadReplies from './DoubtThreadReplies';
import { connect } from 'umi';

const DoubtThreadDisplay = props => {
  const [loading, setLoading] = useState(false);

  const { attempt } = props;
  const doubtThread = attempt.doubt_thread;
  const toggleDoubtStatus = async () => {
    setLoading(true);
    await updateDoubtThread(doubtThread.id, {
      doubt_thread: {
        status: doubtThread.status === 'resolved' ? 'pending' : 'resolved',
      },
    });
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'attempt/fetchByAttemptId',
        payload: attempt.id,
      });
    }
    setLoading(false);
  };
  return (
    <Card
      style={{
        marginTop: '1em',
        marginBottom: '1em',
      }}
      title={
        doubtThread && (
          <div>
            <Row>
              <Col>{doubtThread.title}</Col>
              <Col offset={1}>
                <Button
                  onClick={toggleDoubtStatus}
                  loading={loading}
                  type={doubtThread.status !== 'resolved' ? 'primary' : 'default'}
                >
                  {doubtThread.status === 'resolved' ? 'Mark As Unresolved' : 'Mark As Resolved'}
                </Button>
              </Col>
            </Row>
          </div>
        )
      }
    >
      <Typography.Paragraph
        style={{
          marginBottom: '2em',
        }}
      >
        {parseKatex(doubtThread && doubtThread.body)}
      </Typography.Paragraph>
      <Divider />
      <DoubtThreadReplies
        attempt={props.attempt}
        getAttempt={props.getAttempt}
        doubtThread={doubtThread}
      />
    </Card>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(DoubtThreadDisplay);
