import { Button, Tag, Input, Table,Space, Typography,Row } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, LockOutlined } from '@ant-design/icons';
import {getAllProblems} from "@/services/problem";
import AttemptStatusTag from "@/components/ProblemAttempt/AttemptStatusTag";
import DoubtStatusTag from "@/components/Doubt/DoubtStatusTag";
import {ProblemDifficultyTag, PROBLEM_DIFFICULTY_MAP} from "@/components/Problems/ProblemDifficulty";
import Tooltip from "antd/es/tooltip";
import TimeCard from "@/pages/Dashboard/components/TimeCard";
import {connect} from 'umi'
import UserAttemptList from "@/pages/Dashboard/components/UserAttemptList";
const Dashboard = (props) => {

  const [problems, setProblems] = useState(null);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: ''
  })

  useEffect(() => {
    const { dispatch } = props;

    if (dispatch) {
      dispatch({
        type: 'attempts/fetch',
      });
    }
  },[])


  return (
    <PageContainer>
      <TimeCard
        stye={{
          height:"50%",
        }}
      />
      <UserAttemptList
        style={{
          height:"50%",
          marginTop: "1em"
        }}
      />

    </PageContainer>
  );
};

export default connect(({ attempts, loading }) => ({
  attempts: attempts,
  loading: loading.models.attempts,
}))(Dashboard);
