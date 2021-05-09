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
import { deleteHint, updatePosition } from '@/services/hints';
import { UserAccessLevelTag } from '@/components/Users/UsersAccessLevel';
import {
  PROBLEM_DIFFICULTY_MAP,
  ProblemDifficultyTag,
} from '@/components/Problems/ProblemDifficulty';

const HintList = props => {
  const { problems, hints} = props;
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
  const callUpdatePosition = async (hintId, delta) => {
    updatePosition(hintId, delta).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'hints/fetch',
        });
      }
    });
  };

  const callDeleteHint = async hintId => {
    deleteHint(hintId).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'hints/fetch',
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
      title: 'Hint',
      dataIndex: 'title',
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['title']
          ? (`hint_id=${record.id},` + record['title'].toString().toLowerCase()).includes(
              value.toLowerCase(),
            )
          : '',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Hint'}
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
      title: 'Problem',
      dataIndex: 'problem',
      render: (problem, idx) => {
        return (
          <Row key={`problem_id=${idx}`}>
            <Tag>
              <a href={`/admin/problems?active_tab=2&problem_id=${problem?.id}`}>
                {' '}
                {problem?.title}
              </a>
            </Tag>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (problem, record) => {
        const serializedProblem = `${problem.id}.${problem.title}`;

        return serializedProblem.toLowerCase().includes(value.toLowerCase());
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
      title: 'Actions',
      key: 'action',
      width: 100,
      render: hint => (
        <Row>
          <Button onClick={() => callDeleteHint(hint.id)} icon={<DeleteOutlined />} />
          <Button
            style={{
              marginLeft: '0.1em',
            }}
            onClick={() => history.push(`/admin/hints?active_tab=2&hint_id=${hint.id}`)}
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
      render: hint => {
        let idx = 0;
        while (idx < hints.length) {
          if (hints[idx].id === hint.id) {
            break;
          }
          idx++;
        }

        const isFirst = idx === 0 || hints[idx - 1]?.problem?.id !== hints[idx]?.problem?.id;
        const isLast =
          idx === hints.length - 1 ||
          hints[idx + 1]?.problem?.id !== hints[idx]?.problem?.id;

        return (
          <Row>
            {
              <Button
                disabled={isFirst}
                danger={isFirst}
                type={isLast && 'primary'}
                style={{ width: '100%', marginBottom: '0.1em' }}
                onClick={() => callUpdatePosition(hint.id, 1)}
                icon={<ArrowUpOutlined />}
              />
            }
            {
              <Button
                disabled={isLast}
                danger={isLast}
                type={isFirst && 'primary'}
                style={{ width: '100%' }}
                onClick={() => callUpdatePosition(hint.id, -1)}
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
      dataSource={hints}
      columns={columns}
      rowKey={record => record.id}
    />
  );
};

export default connect(({ problems, hints, loading }) => ({
  hints: hints,
  loading: loading.models.hints,
}))(HintList);
