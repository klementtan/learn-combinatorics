import { Button, Tag, Input, Table, Space, Typography, Card } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, LockOutlined } from '@ant-design/icons';
import { getAllProblems } from '@/services/problem';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import {
  ProblemDifficultyTag,
  PROBLEM_DIFFICULTY_MAP,
} from '@/components/Problems/ProblemDifficulty';
import Tooltip from 'antd/es/tooltip';
import TimePieChart from '@/pages/Dashboard/components/TimePieChart';
const contentList = {
  '0': <TimePieChart dataIndex={'chapter'} />,
  '1': <TimePieChart dataIndex={'lecture'} />,
  '2': <TimePieChart dataIndex={'problem'} />,
};

const TimeCard = () => {
  const [key, setKey] = useState('0');

  const onTabChange = (key, type) => {
    setKey(key);
  };

  const tabList = [
    {
      key: '0',
      tab: 'Chapter',
    },
    {
      key: '1',
      tab: 'Lecture',
    },
    {
      key: '2',
      tab: 'Problem',
    },
  ];

  return (
    <Card
      style={{ width: '100%' }}
      title="Activity Overview"
      tabList={tabList}
      activeTabKey={key}
      onTabChange={key => {
        onTabChange(key, 'key');
      }}
    >
      {contentList[key]}
    </Card>
  );
};

export default TimeCard;
