import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import TimeCard from '@/pages/Dashboard/components/TimeCard';
import { connect } from 'umi';
import UserAttemptList from '@/pages/Dashboard/components/UserAttemptList';
import NusEmailVerification from "@/components/Settings/NusEmailVerification";
const Dashboard = props => {
  const [problems, setProblems] = useState(null);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  useEffect(() => {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'attempts/fetch',
      });
    }
  }, []);

  return (
    <PageContainer>
      <TimeCard
        stye={{
          height: '50%',
        }}
      />
      <UserAttemptList
        style={{
          height: '50%',
          marginTop: '1em',
        }}
      />
      <NusEmailVerification/>
    </PageContainer>
  );
};

export default connect(({ attempts, loading }) => ({
  attempts: attempts,
  loading: loading.models.attempts,
}))(Dashboard);
