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
import { deleteLecture, updatePosition } from '@/services/lecture';

const LectureList = props => {
  const { lectures } = props;
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
  const callUpdatePosition = async (lectureId, delta) => {
    updatePosition(lectureId, delta).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'lectures/fetch',
        });
      }
    });
  };

  const callDeleteLecture = async lectureId => {
    deleteLecture(lectureId).then(resp => {
      const { dispatch } = props;
      if (dispatch) {
        dispatch({
          type: 'lectures/fetch',
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
  const problemToS = problems => {
    var ret = '';
    for (var i = 0; i < problems?.length; i++) {
      ret += `problem_id=${problems[i].id},` + problems[i].title?.toString().toLowerCase();
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
      title: 'Lecture',
      dataIndex: 'title',
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['title']
          ? (`lecture_id=${record.id},` + record['title'].toString().toLowerCase()).includes(
              value.toLowerCase(),
            )
          : '',
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
      title: 'Chapter',
      dataIndex: 'chapter',
      render: (chapter, idx) => {
        return (
          <Row key={`chapter_id:${idx}`}>
            <Tag>
              <a href={`#/admin/chapters?active_tab=2&chapter_id=${chapter?.id}`}>
                {' '}
                {chapter?.title}
              </a>
            </Tag>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (chapter, record) => {
        const serializedChapter = `${chapter.id}.${chapter.title}`;

        return serializedChapter.toLowerCase().includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Chapter'}
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
      title: 'Problems',
      dataIndex: 'problems',
      render: (problems, idx) => {
        return (
          <Row key={`problems_${idx}`}>
            {problems.map((problem, idx) => (
              <Col key={idx}>
                <Tag>
                  <a href={`#/admin/problems?layout=0&problem_id=${problem?.id}`}>
                    {problem?.title}
                  </a>
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
        const problems = record['problems'];
        const serializedProblems = problemToS(problems);

        return record['problems'] ? serializedProblems.includes(value.toLowerCase()) : '';
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Problems'}
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
      render: lecture => (
        <Row>
          <Button onClick={() => callDeleteLecture(lecture.id)} icon={<DeleteOutlined />} />
          <Button
            style={{
              marginLeft: '0.1em',
            }}
            onClick={() => history.push(`/admin/lectures?active_tab=2&lecture_id=${lecture.id}`)}
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
      render: lecture => {
        let idx = 0;
        while (idx < lectures.length) {
          if (lectures[idx].id === lecture.id) {
            break;
          }
          idx++;
        }

        const isFirst = idx === 0 || lectures[idx - 1]?.chapter?.id !== lectures[idx]?.chapter?.id;
        const isLast =
          idx === lecture.length - 1 ||
          lectures[idx + 1]?.chapter?.id !== lectures[idx]?.chapter?.id;

        return (
          <Row>
            {
              <Button
                disabled={isFirst}
                danger={isFirst}
                type={isLast && 'primary'}
                style={{ width: '100%', marginBottom: '0.1em' }}
                onClick={() => callUpdatePosition(lecture.id, 1)}
                icon={<ArrowUpOutlined />}
              />
            }
            {
              <Button
                disabled={isLast}
                danger={isLast}
                type={isFirst && 'primary'}
                style={{ width: '100%' }}
                onClick={() => callUpdatePosition(lecture.id, -1)}
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
      dataSource={lectures}
      columns={columns}
      rowKey={record => record.id}
    />
  );
};

export default connect(({ lectures, loading }) => ({
  lectures: lectures,
  loading: loading.models.lectures,
}))(LectureList);
