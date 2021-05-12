import React, { useEffect, useState } from 'react';
import { connect, useIntl, useLocation, history } from 'umi';
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
import qs from 'qs';
import { notification } from 'antd';

const ViewAttempt = props => {
  const [startTime, setStartTime] = useState(moment.now());
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });
  const getProblemAttempt = async problemId => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'attempt/fetchByAttemptId',
        payload: params.attempt_id,
      });
    }
  };
  useEffect(async () => {
    if (!params.attempt_id) {
      notification.error({
        message: `Invalid request`,
        description: 'Please select a valid attempt',
      });
      history.push('/admin/attempts');
    }
    await getProblemAttempt(params.attempt_id);
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
}))(ViewAttempt);
