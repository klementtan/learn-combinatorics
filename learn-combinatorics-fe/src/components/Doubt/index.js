import React, { useState, useEffect, useContext } from 'react';
import { Spin, Card, Typography } from 'antd';
import DoubtForm from './DoubtForm';
import DoubtThreadDisplay from './DoubtThreadDisplay';
import DoubtStatusTag from './DoubtStatusTag';
import { connect } from 'umi';

const DoubtThread = props => {
  const { attempt } = props;
  const doubtThread = attempt.doubt_thread;
  useEffect(() => {}, [attempt]);
  return (
    <Card
      loading={props.loading}
      style={{
        width: '100%',
      }}
      title={
        <>
          {'Doubt'} {doubtThread && <DoubtStatusTag status={doubtThread.status} />}
        </>
      }
    >
      {doubtThread ? <DoubtThreadDisplay /> : <DoubtForm />}
    </Card>
  );
};

export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(DoubtThread);
