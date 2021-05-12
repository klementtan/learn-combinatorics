import { Button, Tag, Input, Table, Space, Row, Col, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EnterOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect, useLocation, history } from 'umi';
import qs from 'qs';
import { deleteChapter, updatePosition } from '@/services/chapters';
import { ACCESS_LEVELS, tagNames, UserAccessLevelTag } from '@/components/Users/UsersAccessLevel';
import { getAllAttemptAdmin } from '@/services/attempt';
import {
  PROBLEM_DIFFICULTY_MAP,
  ProblemDifficultyTag,
} from '@/components/Problems/ProblemDifficulty';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import moment from 'moment';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
const AttemptList = props => {
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
  const [attempts, setAttempts] = useState();
  const [success, setSuccess] = useState(-1);
  const callUpdatePosition = async (chapterId, delta) => {
    updatePosition(chapterId, delta).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'chapters/fetch',
        });
      }
    });
  };
  useEffect(() => {
    getAllAttemptAdmin()
      .then(resp => {
        setSuccess(1);
        setAttempts(resp.attempts);
      })
      .catch(err => setSuccess(0));
  }, []);

  const callDeleteChapter = async chapterId => {
    deleteChapter(chapterId).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'chapters/fetch',
        });
      }
    });
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  const getFilteredValues = entity => {
    var filterVal = [];
    Object.keys(params).forEach((key, idx) => {
      if (key.includes(entity)) {
        filterVal.push(`${key}=${params[key]}`);
      }
    });
    return filterVal;
  };
  const searchInput = useRef(null);
  const lecturesToS = lectures => {
    var ret = '';
    for (var i = 0; i < lectures?.length; i++) {
      ret += `lecture_id=${lectures[i].id},` + lectures[i].title?.toString().toLowerCase();
    }
    return ret;
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      width: '20%',
      render: (user, idx) => {
        let email = user.nus_email ? user.nus_email : user.primary_email;
        return (
          <Typography.Text key={`user_id=${user.id}`}>
            {user.name}({email})
          </Typography.Text>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const user = record['user'];
        const serializedUser = `${user.id},${user.name},${user.primary_email},${user.nus_email}`;

        return serializedUser.includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search User'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'title')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'title')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: 'User Access',
      dataIndex: 'user',
      width: '10%',
      render: (user, idx) => {
        const roles = user['roles'];
        return (
          <Row gutter={[5, 5]}>
            {roles.map((role, idx) => {
              return (
                <Col key={`user_id=${user.id},role=${role.name}`}>
                  <UserAccessLevelTag style={{ margin: '1em' }} role={role.name} />
                </Col>
              );
            })}
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const simple_roles = record?.user?.roles.map(role => role.name);
        if (simple_roles?.includes(value)) {
          return true;
        }
      },
      filters: [
        {
          text: tagNames[ACCESS_LEVELS.PUBLIC_USER],
          value: ACCESS_LEVELS.PUBLIC_USER,
        },
        {
          text: tagNames[ACCESS_LEVELS.NUS_USER],
          value: ACCESS_LEVELS.NUS_USER,
        },
        {
          text: tagNames[ACCESS_LEVELS.MOD_USER],
          value: ACCESS_LEVELS.MOD_USER,
        },
        {
          text: tagNames[ACCESS_LEVELS.ADMIN],
          value: ACCESS_LEVELS.ADMIN,
        },
      ],
    },
    {
      title: 'Problem',
      dataIndex: 'problem',
      render: (problem, idx) => {
        return (
          <Row key={idx}>
            <a href={`#/admin/problems?active_tab=2&problem_id=${problem?.id}`}>
              {problem?.title}{' '}
            </a>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const problem = record['problem'];
        const serializedProblem =
          `problem_id=${problem.id},` + problem.title?.toString().toLowerCase();

        return serializedProblem.includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Problem'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'title')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'title')}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: 'Status',
      width: '10%',
      filters: [
        {
          text: 'No Submissions',
          value: 'no_submissions',
        },
        {
          text: 'Pass',
          value: 'pass',
        },
        {
          text: 'In Progress',
          value: 'in_progress',
        },
        {
          text: 'Skipped',
          value: 'skipped',
        },
      ],
      onFilter: (value, record) => {
        return record.status && value === record.status && true;
      },
      render: (attempt, idx) => {
        if (attempt.status) {
          return <AttemptStatusTag key={idx + '_tag'} status={attempt.status} />;
        } else {
          return <AttemptStatusTag key={idx + '_tag'} status={'no_submissions'} />;
        }
      },
    },
    {
      title: 'Doubt',
      width: '5%',
      filters: [
        {
          text: 'Pending',
          value: 'pending',
        },
        {
          text: 'Resolved',
          value: 'resolved',
        },
      ],
      onFilter: (value, attempt) => {
        const doubt_thread = attempt.doubt_thread;
        if (!doubt_thread) {
          return null;
        }
        return doubt_thread.status === value;
      },
      render: (attempt, idx) => {
        const doubt_thread = attempt.doubt_thread;
        if (!doubt_thread) {
          return null;
        }
        return <DoubtStatusTag key={attempt.id + '_attempt'} status={doubt_thread.status} />;
      },
    },
    {
      title: 'New Reply',
      width: '5%',
      filters: [
        {
          text: 'Yes',
          value: true,
        },
      ],
      onFilter: (value, attempt) => {
        const doubt_thread = attempt.doubt_thread;
        if (!doubt_thread) return false;
        if (doubt_thread?.status === 'resolved') return false;
        const doubt_replies = doubt_thread?.doubt_replies;
        if (!doubt_replies || doubt_replies.length === 0) {
          return false;
        }
        const latestUserRoles = doubt_replies[0]?.user.roles.map(role => role.name);
        if (latestUserRoles?.includes(ACCESS_LEVELS.ADMIN)) {
          return false;
        }
        return true;
      },
      render: (attempt, idx) => {
        const doubt_thread = attempt.doubt_thread;
        if (!doubt_thread) return;
        if (doubt_thread?.status === 'resolved') return;
        const doubt_replies = doubt_thread?.doubt_replies;
        if (!doubt_replies || doubt_replies.length === 0) {
          return;
        }
        const latestUserRoles = doubt_replies[0]?.user.roles.map(role => role.name);
        if (latestUserRoles?.includes(ACCESS_LEVELS.ADMIN)) {
          return;
        }
        return (
          <Tag key={idx} color={'green'}>
            Yes
          </Tag>
        );
      },
    },
    {
      title: 'Time Spent',
      width: '10%',
      render: (attempt, idx) => {
        return (
          <Typography.Text>
            {' '}
            {moment
              .duration(attempt.attempt_time, 'seconds')
              .locale('en')
              .humanize()}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
      width: 100,
      render: attempt => (
        <Row>
          <Button
            style={{
              marginLeft: '0.1em',
            }}
            onClick={() => history.push(`/admin/attempts?active_tab=1&attempt_id=${attempt.id}`)}
            icon={<EnterOutlined />}
          ></Button>
        </Row>
      ),
    },
  ];
  return (
    <>
      {
        <Table
          bordered
          loading={success === -1}
          dataSource={attempts}
          columns={columns}
          rowKey={record => record.id}
        />
      }
    </>
  );
};

export default AttemptList;
