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
import { deleteChapter, updatePosition } from '@/services/chapters';

const ChapterList = props => {
  const { chapters } = props;
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });
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
      title: '#',
      dataIndex: 'id',
      colSpan: 1,
      width: '5%',
    },
    {
      title: 'Chapter',
      dataIndex: 'title',
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record['title']
          ? (`chapter_id=${record.id},` + record['title'].toString().toLowerCase()).includes(
              value.toLowerCase(),
            )
          : '',
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
      title: 'Lectures',
      dataIndex: 'lectures',
      render: (lectures, idx) => {
        return (
          <Row key={idx}>
            {lectures.map((lecture, idx) => (
              <Col key={idx}>
                <Tag>
                  <Typography.Link>
                    <a href={`#/admin/lectures?active_tab=2&lecture_id=${lecture?.id}`}>
                      {lecture?.title}{' '}
                    </a>
                  </Typography.Link>
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
        const lectures = record['lectures'];
        const serializedLectures = lecturesToS(lectures);

        return record['lectures'] ? serializedLectures.includes(value.toLowerCase()) : '';
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
      title: 'Actions',
      key: 'action',
      width: 100,
      render: chapter => (
        <Row>
          <Button onClick={() => callDeleteChapter(chapter.id)} icon={<DeleteOutlined />} />
          <Button
            style={{
              marginLeft: '0.1em',
            }}
            onClick={() => history.push(`/admin/chapters?active_tab=2&chapter_id=${chapter.id}`)}
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
      render: chapter => (
        <Row>
          {chapter?.position !== 1 && (
            <Button onClick={() => callUpdatePosition(chapter.id, 1)} icon={<ArrowUpOutlined />} />
          )}
          {chapter?.position !== chapters.length && (
            <Button
              onClick={() => callUpdatePosition(chapter.id, -1)}
              icon={<ArrowDownOutlined />}
            />
          )}
        </Row>
      ),
    },
  ];

  /**
   * 国际化配置
   */

  return (
    <Table
      bordered
      loading={props.loading}
      dataSource={chapters}
      columns={columns}
      rowKey={record => record.id}
    />
  );
};

export default connect(({ chapters, loading }) => ({
  chapters: chapters,
  loading: loading.models.chapters,
}))(ChapterList);
