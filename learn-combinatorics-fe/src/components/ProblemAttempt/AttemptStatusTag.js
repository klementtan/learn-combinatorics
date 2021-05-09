import { Tag } from 'antd';
import React from 'react';

const AttemptStatusTag = props => {
  const { status } = props;
  const getStatusText = currStatus => {
    const statusTextMap = {
      pass: 'Pass',
      in_progress: 'In Progress',
      skipped: 'Skipped',
      no_submissions: 'No Submissions',
    };
    return statusTextMap[currStatus];
  };
  const getColor = currStatus => {
    const statusColorMap = {
      pass: 'green',
      in_progress: 'orange',
      skipped: 'red',
      no_submissions: '',
    };
    return statusColorMap[currStatus];
  };
  return <Tag color={getColor(status)}>{getStatusText(status)}</Tag>;
};
export default AttemptStatusTag;
