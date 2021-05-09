import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Typography, Col } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect, history, Redirect, useLocation } from 'umi';
import qs from 'qs';
import { getLecture, updateLecture, updatePosition } from '@/services/lecture';
import List from 'antd/es/list';
import Select from 'antd/es/select';

const LectureDetails = props => {
  const [prevLecture, setPrevLecture] = useState({});
  const [lecture, setLecture] = useState({});
  const [prevPrams, setPrevParams] = useState({});
  const params = qs.parse(useLocation().search, { ignoreQueryPrefix: true });

  useEffect(() => {
    if (JSON.stringify(params) !== JSON.stringify(prevPrams)) {
      setPrevParams(params);
    } else {
      return;
    }
    if (params.lecture_id) {
      getLecture(params.lecture_id).then(resp => {
        setPrevLecture(resp.lecture);
        setLecture(resp.lecture);
      });
    }
  }, [params]);

  const onSelectLecture = lectureId => {
    return history.push(`/admin/lectures?lecture_id=${lectureId}&active_tab=2`);
  };

  const onSelectChapter = chapterIdx => {
    setLecture({
      ...lecture,
      chapter: props.chapters[chapterIdx],
    });
  };
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async payload => {
    setSuccess(false);
    setErrorMessage('');
    setLoading(true);
    updateLecture(lecture.id, {
      chapter_id: lecture.chapter.id,
      lecture: {
        title: lecture.title,
      },
    })
      .then(resp => {
        setLecture(resp.lecture);
        const { dispatch } = props;
        if (dispatch) {
          dispatch({
            type: 'lectures/fetch',
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
            placeholder="Select Lecture"
            optionFilterProp="children"
            onSelect={onSelectLecture}
            value={prevLecture?.id ? `${prevLecture.id}.  ${prevLecture.title}` : null}
          >
            {props.lectures.map((currLecture, idx) => {
              return (
                <Select.Option key={idx} value={currLecture.id}>
                  {currLecture.id}. {currLecture.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </Row>

      {JSON.stringify(lecture) !== JSON.stringify({}) && (
        <>
          <Row justify={'center'}>
            <Form
              style={{
                width: '75%',
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Lecture Title"
                rules={[{ required: true, message: 'Please input title of lecture' }]}
              >
                <Input
                  onChange={e => setLecture({ ...lecture, title: e.target.value })}
                  placeholder="Lecture Title"
                  value={lecture?.title}
                />
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
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
                  value={
                    lecture?.chapter?.id ? `#${lecture.chapter.id} ${lecture.chapter.title}` : null
                  }
                >
                  {props.chapters.map((currChapter, idx) => {
                    return (
                      <Select.Option key={idx} value={idx}>
                        #{currChapter.id} {currChapter.title}
                      </Select.Option>
                    );
                  })}
                </Select>
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
              header={<div>Problems</div>}
              bordered
              dataSource={lecture?.problems}
              renderItem={problem => (
                <List.Item>
                  <Typography.Link href={`/admin/problems?problem_id=${problem.id}&active_tab=2`}>
                    {problem.title}
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

export default connect(({ chapters, lectures, loading }) => ({
  lectures: lectures,
  chapters: chapters,
  loading: loading.models.chapters,
}))(LectureDetails);
