import { Tag } from 'antd';
import React from 'react';

export const ACCESS_LEVELS = {
  PUBLIC_USER: 'PUBLIC_USER',
  NUS_USER: 'NUS_USER',
  MOD_USER: 'MOD_USER',
  ADMIN: 'ADMIN',
};

export const tagColours = {
  [ACCESS_LEVELS.PUBLIC_USER]: 'green',
  [ACCESS_LEVELS.NUS_USER]: 'purple',
  [ACCESS_LEVELS.MOD_USER]: 'orange',
  [ACCESS_LEVELS.ADMIN]: 'magenta',
};

export const tagNames = {
  [ACCESS_LEVELS.PUBLIC_USER]: 'Public User',
  [ACCESS_LEVELS.NUS_USER]: 'NUS User',
  [ACCESS_LEVELS.MOD_USER]: 'Module User',
  [ACCESS_LEVELS.ADMIN]: 'Admin',
};

export const UserAccessLevelTag = props => {
  const { role } = props;
  return <Tag color={tagColours[role]}>{tagNames[role]}</Tag>;
};
