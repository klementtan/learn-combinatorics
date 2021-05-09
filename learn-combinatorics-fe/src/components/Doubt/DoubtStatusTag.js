import { Tag } from 'antd';
import React from 'react';

const DoubtStatusTag = props => {
  const { status } = props;
  return (
    <Tag color={status === 'resolved' ? 'green' : 'orange'}>
      {status === 'resolved' ? 'resolved' : 'pending'}
    </Tag>
  );
};
export default DoubtStatusTag;
