import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Col, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getAllProblems } from '@/services/problem';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import ProblemDifficulty, { PROBLEM_DIFFICULTY_MAP } from '@/components/Problems/ProblemDifficulty';
import { connect, history, Redirect } from 'umi';
import qs from 'qs';
import { createLecture } from '@/services/lecture';
import Select from 'antd/es/select';
import { UserAccessLevelTag, ACCESS_LEVELS, tagNames } from '@/components/Users/UsersAccessLevel';
import { parseKatex } from '@/utils/Katex';

const ProblemCreate = props => {
  const { lectures, problem, setProblem } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLecture, setSelectedLecture] = useState({});

  const onSelectLecture = lectureIdx => {
    setProblem({ ...problem, lecture_id: lectures[lectureIdx].id });
    setSelectedLecture(lectures[lectureIdx]);
  };
  const [previewMode, setPreviewMode] = useState(false);

  const onSelectUserAccessLevel = accessLevel => {
    setProblem({ ...problem, problem: { ...problem.problem, privilege_level: accessLevel } });
  };
  const onSelectDifficultyLevel = difficulty => {
    setProblem({ ...problem, problem: { ...problem.problem, difficulty: difficulty } });
  };
  useEffect(() => {
    if (problem.lecture_id === setSelectedLecture.id) return;
    lectures.forEach(lecture => {
      if (lecture.id === problem.lecture_id) {
        setSelectedLecture(lecture);
      }
    });
  }, [props]);
  return (
    <>
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
          }}
          name="basic"
        >
          <Form.Item label={'Select the lecture it belongs to'} required>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select Lecture"
              optionFilterProp="children"
              onSelect={onSelectLecture}
              value={
                selectedLecture?.id ? `${selectedLecture.id}.  ${selectedLecture.title}` : null
              }
            >
              {props.lectures.map((currLecture, idx) => {
                return (
                  <Select.Option key={idx} value={currLecture.id}>
                    {currLecture.id}. {currLecture.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item required label={'Access Level'}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Access Level"
              optionFilterProp="children"
              onSelect={onSelectUserAccessLevel}
              value={problem?.problem?.privilege_level}
            >
              {Object.keys(ACCESS_LEVELS).map((accessLevel, idx) => {
                return (
                  <Select.Option key={idx} value={ACCESS_LEVELS[accessLevel]}>
                    {tagNames[ACCESS_LEVELS[accessLevel]]}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Problem Title"
            required
            rules={[{ required: true, message: 'Please input title of problem' }]}
          >
            <Input
              onChange={e =>
                setProblem({ ...problem, problem: { ...problem.problem, title: e.target.value } })
              }
              placeholder="Problem Title"
              value={problem?.problem?.title}
            />
          </Form.Item>
          <Form.Item required label={'Difficulty'}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Access Level"
              optionFilterProp="children"
              onSelect={onSelectDifficultyLevel}
              value={PROBLEM_DIFFICULTY_MAP[problem.problem.difficulty]}
            >
              {Object.keys(PROBLEM_DIFFICULTY_MAP).map((difficulty, idx) => {
                return (
                  <Select.Option key={idx} value={difficulty}>
                    {PROBLEM_DIFFICULTY_MAP[difficulty]}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Typography.Text strong>
            One of "Problem body", "Problem body pdf file" is required
          </Typography.Text>
          <Form.Item
            label="Problem Body"
            rules={[{ required: true, message: 'Please input title of problem' }]}
          >
            {previewMode ? (
              <Typography.Paragraph>{parseKatex(problem.problem.body)}</Typography.Paragraph>
            ) : (
              <Input.TextArea
                rows={4}
                onChange={e =>
                  setProblem({
                    ...problem,
                    problem: { ...problem.problem, body: e.target.value },
                  })
                }
                placeholder="Problem Body"
                value={problem?.problem?.body}
              />
            )}
            <Button style={{ marginTop: '1em' }} onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? 'Preview raw text' : 'Preview Latex'}
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </>
  );
};

export default connect(({ lectures, loading }) => ({
  lectures: lectures,
  loading: loading.models.lectures,
}))(ProblemCreate);
