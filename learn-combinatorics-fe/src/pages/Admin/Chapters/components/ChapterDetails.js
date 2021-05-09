import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Typography, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, history, Redirect, useLocation } from 'umi';
import qs from 'qs';
import { createChapter, getChapter, updateChapter, updatePosition } from '@/services/chapters';
import List from 'antd/es/list';
import Select from 'antd/es/select';

const ChapterDetails = props => {
  const [chapter, setChapter] = useState({});
  const [prevPrams, setPrevParams] = useState({});
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (JSON.stringify(params) !== JSON.stringify(prevPrams)) {
      setPrevParams(params);
    } else {
      return;
    }
    if (params.chapter_id) {
      getChapter(params.chapter_id).then(resp => setChapter(resp.chapter));
    }
  }, [params]);

  const onSelectChapter = chapterId => {
    return history.push(`/admin/chapters?chapter_id=${chapterId}&active_tab=2`);
  };

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async payload => {
    setSuccess(false);
    setErrorMessage('');
    setLoading(true);
    updateChapter(chapter.id, chapter)
      .then(resp => {
        setChapter(resp.chapter);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'chapters/fetch',
          });
        }
        setSuccess(true);
      })
      .catch(err => {
        setErrorMessage(err.error);
      });
    setLoading(false);
  };

  return (
    <Col>
      <Row justify={'center'}>
        <div style={{ width: '75%', marginBottom: '1em' }}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select Chapter"
            optionFilterProp="children"
            onSelect={onSelectChapter}
            value={chapter.id ? `${chapter.id}.  ${chapter.title}` : null}
          >
            {props.chapters.map((currChapter, idx) => {
              return (
                <Select.Option key={idx} value={currChapter.id}>
                  {currChapter.id}. {currChapter.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </Row>

      {JSON.stringify(chapter) !== JSON.stringify({}) && (
        <>
          <Row justify={'center'}>
            <Form
              style={{
                width: '75%',
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Chapter Title"
                rules={[{ required: true, message: 'Please input title of chapter' }]}
              >
                <Input
                  onChange={e => setChapter({ ...chapter, title: e.target.value })}
                  placeholder="Chapter Title"
                  value={chapter.title}
                />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
              <Form.Item>
                {success && <Tag color={'green'}>Success</Tag>}

                {errorMessage.length !== 0 && <Tag color={'orange'}>{errorMessage}</Tag>}
              </Form.Item>
            </Form>
          </Row>
          <Row justify={'center'}>
            <List
              style={{
                width: '75%',
              }}
              header={<div>Lectures</div>}
              bordered
              dataSource={chapter.lectures}
              renderItem={lecture => (
                <List.Item>
                  <Typography.Link href={`/admin/lectures?lecture_id=${lecture.id}&active_tab=2`}>
                    {lecture.title}
                  </Typography.Link>
                </List.Item>
              )}
            />
          </Row>
        </>
      )}
    </Col>
  );
};

export default connect(({ chapters, loading }) => ({
  chapters: chapters,
  loading: loading.models.chapters,
}))(ChapterDetails);
