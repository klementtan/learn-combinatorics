import { Button, Tag, Input, Table, Space, Row, Card, Typography } from 'antd';
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
import {ACCESS_LEVELS, tagNames, UserAccessLevelTag} from "@/components/Users/UsersAccessLevel";
import {getAllAttemptAdmin} from "@/services/attempt";
import {PROBLEM_DIFFICULTY_MAP, ProblemDifficultyTag} from "@/components/Problems/ProblemDifficulty";
import AttemptStatusTag from "@/components/ProblemAttempt/AttemptStatusTag";
import moment from "moment";
import DoubtStatusTag from "@/components/Doubt/DoubtStatusTag";
const UserAttemptList = props => {
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });


  const searchInput = useRef(null);


  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };
  const columns = [
    {
      title: 'Problem',
      dataIndex: 'problem',
      render: (problem, idx) => {
        return (
          <Row key={idx}>
            <a href={`/problems/${problem.id}/attempt`}>
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
        return (`${problem.title}:${problem.id}`).toLowerCase().includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Problem'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'problem')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'problem')}
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
          <Row key={idx}>
            <Typography.Text >
              {lecture.title}{' '}
            </Typography.Text>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const lecture = record['lecture'];
        return (`${lecture.title}:${lecture.id}`).toLowerCase().includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Lectures'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'lecture')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'lecture')}
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
          <Row key={idx}>
            <Typography.Text >
              {chapter.title}{' '}
            </Typography.Text>
          </Row>
        );
      },
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const chapter = record['chapter'];
        return (`${chapter.title}:${chapter.id}`).toLowerCase().includes(value.toLowerCase());
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={'Search Chapters'}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, 'chapter')}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, 'chapter')}
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
          value: 'no_submissions'
        },
        {
          text: 'Pass',
          value: 'pass'
        },
        {
          text: 'In Progress',
          value: 'in_progress',
        },
        {
          text: 'Skipped',
          value: 'skipped'
        }
      ],
      onFilter: (value, record) => {
        return record.status && value === record.status && true
      },
      render: (attempt, idx) => {
        if (attempt.status){
          return <AttemptStatusTag key={idx + "_tag"} status={attempt.status}/>
        } else {
          return <AttemptStatusTag key={idx+ "_tag"} status={"no_submissions"}/>
        }
      }
    },
    {
      title: 'Doubt',
      width:'5%',
      filters: [
        {
          text: 'Pending',
          value: 'pending'
        },
        {
          text: 'Resolved',
          value: 'resolved'
        }
      ],
      onFilter: (value, attempt) => {
        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) {
          return null
        }
        return doubt_thread.status === value
      },
      render: (attempt, idx) => {

        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) {
          return null
        }
        return (
          <DoubtStatusTag
            key={attempt.id + "_attempt"}
            status={doubt_thread.status}
          />
        )
      }
    },
    {
      title: 'New Reply',
      width:'7%',
      filters: [
        {
          text: 'Yes',
          value: true
        }
      ],
      onFilter: (value, attempt) => {
        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) return false
        if (doubt_thread?.status === 'resolved') return false
        const doubt_replies = doubt_thread?.doubt_replies
        if (!doubt_replies || doubt_replies.length === 0) {
          return false
        }
        const latestUserRoles = doubt_replies[0]?.user.roles.map(role => role.name)
        if (latestUserRoles?.includes(ACCESS_LEVELS.ADMIN)) {
          return false
        }
        return true
      },
      render: (attempt, idx) => {

        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) return
        if (doubt_thread?.status === 'resolved') return
        const doubt_replies = doubt_thread?.doubt_replies
        if (!doubt_replies || doubt_replies.length === 0) {
          return
        }
        if (doubt_replies[0].user.id === props.user.id) {
          return
        }
        return <Tag
          key={idx}
          color={"green"}
        >
          Yes
        </Tag>
      }
    },
    {
      title: 'Time Spent',
      width: '10%',
      render: (attempt, idx) => {
        return <Typography.Text> {moment.duration(attempt.attempt_time, 'seconds').locale('en').humanize() }</Typography.Text>
      }
    }
  ];
  return (
    <Card
      title={"Attempts"}
      style={{marginTop: "1em"}}
    >
        <Table
          bordered
          loading={props.loading}
          dataSource={props.attempts}
          columns={columns}
          rowKey={record => record.id}
        />
    </Card>
  );
};

export default connect(({ user, attempts, loading }) => ({
  attempts: attempts,
  loading: loading.models.attempts,
  user: user.currentUser
}))(UserAttemptList);
