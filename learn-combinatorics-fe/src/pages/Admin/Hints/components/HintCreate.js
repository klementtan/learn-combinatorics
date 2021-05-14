import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Col, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import ProblemDifficulty, { PROBLEM_DIFFICULTY_MAP } from '@/components/Problems/ProblemDifficulty';
import { connect, history, Redirect } from 'umi';
import qs from 'qs';
import { createLecture } from '@/services/lecture';
import Select from 'antd/es/select';
import { UserAccessLevelTag, ACCESS_LEVELS, tagNames } from '@/components/Users/UsersAccessLevel';
import { parseKatex } from '@/utils/Katex';

const HintCreate = props => {
  const { problems, hint, setHint } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProblem, setSelectedProblem] = useState({});

  const onSelectedProblem = problemIdx => {
    setHint({ ...hint, problem_id: problems[problemIdx].id });
    setSelectedProblem(problems[problemIdx]);
  };
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (hint.problem_id === setSelectedProblem.id) return;
    problems.forEach(problem => {
      if (problem.id === hint.problem_id) {
        setSelectedProblem(problem);
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
          <Form.Item label={'Select the problem it belongs to'} required>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select Problem"
              optionFilterProp="children"
              onSelect={onSelectedProblem}
              value={
                selectedProblem?.id ? `${selectedProblem.id}.  ${selectedProblem.title}` : null
              }
            >
              {props.problems.map((currProblem, idx) => {
                return (
                  <Select.Option key={idx} value={idx}>
                    {currProblem.id}. {currProblem.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Hint Title"
            required
            rules={[{ required: true, message: 'Please input title of hint' }]}
          >
            <Input
              onChange={e => setHint({ ...hint, hint: { ...hint.hint, title: e.target.value } })}
              placeholder="Problem Title"
              value={hint?.hint?.title}
            />
          </Form.Item>
          <Typography.Text strong>
            One of "Hint body", "Hint body pdf file", "Hint video" is required
          </Typography.Text>
          <Form.Item
            label="Hint Body"
            rules={[{ required: true, message: 'Please input body of hint' }]}
          >
            {previewMode ? (
              <Typography.Paragraph>{parseKatex(hint.hint.body)}</Typography.Paragraph>
            ) : (
              <Input.TextArea
                rows={4}
                onChange={e =>
                  setHint({
                    ...hint,
                    hint: { ...hint.hint, body: e.target.value },
                  })
                }
                placeholder="Problem Body"
                value={hint?.hint?.body}
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

export default connect(({ problems, loading }) => ({
  problems: problems,
  loading: loading.models.problems,
}))(HintCreate);
