import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getAllProblems } from '@/services/problem';
import AttemptStatusTag from '@/components/ProblemAttempt/AttemptStatusTag';
import DoubtStatusTag from '@/components/Doubt/DoubtStatusTag';
import ProblemDifficulty from '@/components/Problems/ProblemDifficulty';
import { connect, history, Redirect } from 'umi';
import qs from 'qs';
import { createLecture } from '@/services/lecture';
import Select from 'antd/es/select';

const LectureCreate = props => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { chapters } = props;
  const [chapter, setChapter] = useState({});

  const onFinish = async lecturePayload => {
    setErrorMessage('');
    setSuccess(false);
    setLoading(true);
    await createLecture({
      lecture: {
        title: lecturePayload.title,
      },
      chapter_id: chapter.id,
    })
      .then(resp => {
        setSuccess(true);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'chapters/fetch',
          });
          dispatch({
            type: 'lectures/fetch',
          });
        }
      })
      .catch(err => setErrorMessage(err.error));
    setLoading(false);
  };

  const onSelectChapter = chapterIdx => {
    setChapter(chapters[chapterIdx]);
  };

  return (
    <>
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
          }}
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            label={'Chapter'}
            rules={[
              { required: true, message: 'Please input chapter that the lecture belongs to' },
            ]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select Chapter that the lecture belongs to"
              optionFilterProp="children"
              onSelect={onSelectChapter}
              value={chapter.id ? `#${chapter.id} ${chapter.title}` : null}
            >
              {chapters.map((currChapter, idx) => {
                return (
                  <Select.Option key={idx} value={idx}>
                    #{currChapter.id} {currChapter.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Lecture title"
            name="title"
            rules={[{ required: true, message: 'Please input title of chapter' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            {success && <Tag color={'green'}>Success</Tag>}

            {errorMessage.length !== 0 && <Tag color={'orange'}>{errorMessage}</Tag>}
          </Form.Item>
        </Form>
      </Row>
    </>
  );
};

export default connect(({ chapters, loading }) => ({
  chapters: chapters,
  loading: loading.models.chapters,
}))(LectureCreate);
