import { Tag } from 'antd';
import React from 'react';

export const PROBLEM_DIFFICULTY_MAP = {
  0: 'Easy',
  1: 'Medium',
  2: 'Hard',
};

export const ProblemDifficultyTag = props => {
  const { difficulty } = props;
  return (
    <Tag color={['green', 'orange', 'red'][difficulty]}>{PROBLEM_DIFFICULTY_MAP[difficulty]}</Tag>
  );
};
