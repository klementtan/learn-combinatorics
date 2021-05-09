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
import { createChapter, updatePosition } from '@/services/chapters';

const ChapterCreate = props => {
  const [createdId, setCreatedId] = useState(-1);
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async chapterPayload => {
    setCreatedId(-1);
    setErrorMessage('');
    createChapter({
      chapter: chapterPayload,
    })
      .then(resp => {
        setCreatedId(resp.chapter.id);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'chapters/fetch',
          });
        }
      })
      .catch(err => setErrorMessage(err.error));
  };


  return (
    <Row justify={'center'}>
      <Form
        style={{
          width: '75%',
        }}
        name="basic"
        onFinish={onFinish}
      >
        <Form.Item
          label="Chapter title"
          name="title"
          rules={[{ required: true, message: 'Please input title of chapter' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          {createdId !== -1 && <Tag color={'green'}>Success</Tag>}

          {errorMessage.length !== 0 && <Tag color={'orange'}>{errorMessage}</Tag>}
        </Form.Item>
      </Form>
    </Row>
  );
};

export default connect(({ chapters, loading }) => ({
  chapters: chapters,
  loading: loading.models.chapters,
}))(ChapterCreate);
