import { Button, Tag, Input, Table, Space, Row, Col, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect, useLocation, history } from 'umi';
import qs from 'qs';
import { deleteProblem, updatePosition } from '@/services/problem';
import { UserAccessLevelTag } from '@/components/Users/UsersAccessLevel';
import {
  PROBLEM_DIFFICULTY_MAP,
  ProblemDifficultyTag,
} from '@/components/Problems/ProblemDifficulty';

const ProblemList = props => {
  const { problems } = props;
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
  const callUpdatePosition = async (problemId, delta) => {
    updatePosition(problemId, delta).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'problems/fetch',
        });
      }
    });
  };

  const callDeleteProblem = async problemId => {
    deleteProblem(problemId).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'problems/fetch',
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
  const hintsToS = hints => {
    var ret = '';
    for (var i = 0; i < hints?.length; i++) {
      ret += `hint_id=${hints[i].id},` + hints[i].title?.toString().toLowerCase();
    }
    return ret;
  };


  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      colSpan: 1,
      width: '5%',
    },
    {
      title: 'Problem',
      dataIndex: 'title',
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['title']
          ? (`problem_id=${record.id},` + record['title'].toString().toLowerCase()).includes(
              value.toLowerCase(),
            )
          : '',
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
      title: 'Lecture',
      dataIndex: 'lecture',
      render: (lecture, idx) => {
        return (
          <Row key={`lecture_id:${idx}`}>
            <Tag>
              <a href={`#/admin/lectures?active_tab=2&lecture_id=${lecture?.id}`}>
                {' '}
                {lecture?.title}
              </a>
            </Tag>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (lecture, record) => {
        const serializedLecture = `${lecture.id}.${lecture.title}`;

        return serializedLecture.toLowerCase().includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Lecture'}
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
      title: 'Privilege Level',
      dataIndex: 'privilege_level',
      render: (privilegeLevel, record) => (
        <UserAccessLevelTag key={`privilege_level_${record.id}`} role={privilegeLevel} />
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      width: '10%',
      filters: [
        {
          text: PROBLEM_DIFFICULTY_MAP[0],
          value: 0,
        },
        {
          text: PROBLEM_DIFFICULTY_MAP[1],
          value: 1,
        },
        {
          text: PROBLEM_DIFFICULTY_MAP[2],
          value: 2,
        },
      ],
      onFilter: (value, record) => {
        if (record.difficulty === value) {
          return record;
        }
      },

      render: (difficulty, problem) => {
        return (
          <ProblemDifficultyTag key={`problem_${problem.id}_difficulty`} difficulty={difficulty} />
        );
      },
    },
    {
      title: 'Hints',
      dataIndex: 'hints',
      render: (hints, idx) => {
        return (
          <Row key={`hint_${idx}`}>
            {hints.map((hint, idx) => (
              <Col key={idx}>
                <Tag>
                  <a href={`#/admin/hints?active_tab=2&hint_id=${hint?.id}`}>{hint?.title}</a>
                </Tag>
              </Col>
            ))}
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const hints = record['hints'];
        const serializedHints = hintsToS(hints);

        return record['hints'] && serializedHints.includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Hints'}
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
      title: 'Actions',
      key: 'action',
      width: 100,
      render: problem => (
        <Row>
          <Button onClick={() => callDeleteProblem(problem.id)} icon={<DeleteOutlined />} />
          <Button
            style={{
              marginLeft: '0.1em',
            }}
            onClick={() => history.push(`/admin/problems?active_tab=2&problem_id=${problem.id}`)}
            icon={<SettingOutlined />}
          ></Button>
        </Row>
      ),
    },
    {
      title: 'Position',
      key: 'changePosition',
      fixed: 'right',
      width: 100,
      render: problem => {
        let idx = 0;
        while (idx < problems.length) {
          if (problems[idx].id === problem.id) {
            break;
          }
          idx++;
        }

        const isFirst = idx === 0 || problems[idx - 1]?.lecture?.id !== problems[idx]?.lecture?.id;
        const isLast =
          idx === problem.length - 1 ||
          problems[idx + 1]?.lecture?.id !== problems[idx]?.lecture?.id;

        return (
          <Row>
            {
              <Button
                disabled={isFirst}
                danger={isFirst}
                type={isLast && 'primary'}
                style={{ width: '100%', marginBottom: '0.1em' }}
                onClick={() => callUpdatePosition(problem.id, 1)}
                icon={<ArrowUpOutlined />}
              />
            }
            {
              <Button
                disabled={isLast}
                danger={isLast}
                type={isFirst && 'primary'}
                style={{ width: '100%' }}
                onClick={() => callUpdatePosition(problem.id, -1)}
                icon={<ArrowDownOutlined />}
              />
            }
          </Row>
        );
      },
    },
  ];

  /**
   * 国际化配置
   */

  return (
    <Table
      bordered
      loading={props.loading}
      dataSource={problems}
      columns={columns}
      rowKey={record => record.id}
    />
  );
};

export default connect(({ problems, loading }) => ({
  problems: problems,
  loading: loading.models.problems,
}))(ProblemList);
