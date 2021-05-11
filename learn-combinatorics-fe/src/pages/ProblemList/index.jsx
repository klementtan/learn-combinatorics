import { Button, Tag, Input, Table,Space, Typography,Row } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, LockOutlined } from '@ant-design/icons';
import {getAllProblems} from "@/services/problem";
import AttemptStatusTag from "@/components/ProblemAttempt/AttemptStatusTag";
import DoubtStatusTag from "@/components/Doubt/DoubtStatusTag";
import {ProblemDifficultyTag, PROBLEM_DIFFICULTY_MAP} from "@/components/Problems/ProblemDifficulty";
import Tooltip from "antd/es/tooltip";
const ProblemList = () => {

  const [problems, setProblems] = useState(null);
  const [search, setSearch] = useState({
    searchText: '',
    searchedColumn: ''
  })

  const   handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  const searchInput = useRef(null);

  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      colSpan: 1,
      width: '5%'
    },
    {
      title: 'Problem',
      dataIndex: 'title',
      render: (title, problem) => {
        return (
          <>
            {problem.has_access? <a href={`#/problems/${problem.id}/attempt`}>{title}</a> :
            <Row>
              <Typography.Text>
                {title}
              <Tooltip title="You do not have access to this problem. If you're an NUS student please verify you nus email.">
                <LockOutlined/>
              </Tooltip>
              </Typography.Text>
            </Row>}
          </>
        )
      },
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record['title'] ? record['title'].toString().toLowerCase().includes(value.toLowerCase()) : '',
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
      render: (lecture, problem) => {
        return (
          <Typography.Text
            key={`lecture_${lecture.id}`}
          >
            {lecture.title}
          </Typography.Text>
        )
      },
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => {
        return record.lecture.title.toLowerCase().includes(value.toLowerCase())
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
      render: (chapter, problem) => {
        return (
          <Typography.Text
            key={`chapter_${chapter.id}`}
          >
            {chapter.title}
          </Typography.Text>
        )
      },
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => {
        return record.chapter.title.toLowerCase().includes(value.toLowerCase())
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
      )
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      width: '10%',
      filters: [
        {
          text: PROBLEM_DIFFICULTY_MAP[0],
          value: 0
        },
        {
          text: PROBLEM_DIFFICULTY_MAP[1],
          value: 1

        },
        {
          text:PROBLEM_DIFFICULTY_MAP[2],
          value: 2
        }
      ],
      onFilter: (value, record) => {
        if (record.difficulty === value ) {
          return record
        }
      },

      render: (difficulty, problem) => {
        return <ProblemDifficultyTag key={`problem_${problem.id}_difficulty`}difficulty={difficulty}/>
      }
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
        if (value === 'no_submissions' && !record.attempt ) {
          return record
        }
        return record.attempt && value === record.attempt.status && record
      },
      render: (problem) => {
        if (problem.attempt){
          return <AttemptStatusTag key={problem.id + "_tag"} status={problem.status}/>
        } else {
          return <AttemptStatusTag key={problem.id + "_tag"} status={"no_submissions"}/>
        }
      }
    }, {
      title: 'Doubt',
      width:'10%',
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
      onFilter: (value, record) => {
        const attempt = record.attempt
        if (!attempt) {
          return null
        }
        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) {
          return null
        }
        return doubt_thread.status === value
      },
      render: (problem) => {
        const attempt = problem.attempt
        if (!attempt) {
          return null
        }

        const doubt_thread = attempt.doubt_thread
        if (!doubt_thread) {
          return null
        }
        return (
          <DoubtStatusTag
            key={problem.id + "_doubt"}
            status={doubt_thread.status}
          />
        )
      }

    }
  ];
  useEffect(() => {
    getAllProblems()
      .then(resp => {
        setProblems(resp.problems)
      })
      .catch(error=> {
        setProblems([])
      })

  }, [])

  return (
    <PageContainer>
      <Table
        bordered
        loading={problems===null}
        dataSource={problems}
        columns={columns}
        rowKey={(record) => record.id}
      />
    </PageContainer>
  );
};

export default ProblemList;
