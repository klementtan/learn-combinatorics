import React, { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import PageContainer from '@ant-design/pro-layout/es/components/PageContainer';
import ProblemDisplay from '@/components/ProblemAttempt/ProblemDisplay';
import AnswerSubmission from '@/components/ProblemAttempt/AnswerSubmission';
import { Row } from 'antd';
import Col from 'antd/es/grid/col';
import SubmissionList from '@/components/ProblemAttempt/SubmissionList';
import StatusTag from '@/components/ProblemAttempt/StatusTag';
import HintsAndSolution from '@/components/ProblemAttempt/HintsAndSolution/HintsAndSolution';
import moment from 'moment';
import DoubtThread from '@/components/Doubt';

const ProblemAttempt = props => {
  const [startTime, setStartTime] = useState(moment.now());
  const getProblemAttempt = async problemId => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'attempt/fetch',
        payload: problemId,
      });
    }
  };
  useEffect(async () => {
    const { problemId } = props.match.params;
    await getProblemAttempt(problemId);
  }, []);

  return !props.attempt.problem ? (
    <PageContainer loading />
  ) : (
    <PageContainer
      content={
        <Row gutter={16}>
          <Col>{props.attempt.problem.title}</Col>
          <Col>
            {' '}
            <StatusTag style={{ marginLeft: '1em' }} />
          </Col>{' '}
        </Row>
      }
    >
      <Row justify={'center'} gutter={16}>
        <Col span={16}>
          <Row justify={'center'}>
            <ProblemDisplay />
          </Row>
          <Row justify={'center'}>
            <AnswerSubmission />
          </Row>
        </Col>
        <Col span={8}>
          <SubmissionList />
          <HintsAndSolution />
        </Col>
      </Row>
      <Row>
        <DoubtThread />
      </Row>
    </PageContainer>
  );
};
export default connect(({ attempt, loading }) => ({
  attempt: attempt,
  loading: loading.models.attempt,
}))(ProblemAttempt);
