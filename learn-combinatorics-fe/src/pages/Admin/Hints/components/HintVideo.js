import { Button, Form, Tag, Input, Checkbox, Table, Space, Row, Col, Typography } from 'antd';
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
import { UserAccessLevelTag, ACCESS_LEVELS, tagNames } from '@/components/Users/UsersAccessLevel';
import { parseKatex } from '@/utils/Katex';
import Radio from 'antd/es/radio';
import InputNumber from 'antd/es/input-number';
import Collapse from 'antd/es/collapse';
import { BigPlayButton, ControlBar, Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { isValidFile } from '@/utils/utils'; // import css

const HintVideo = props => {
  const { hintVideo, setHintVideo } = props;

  const onUploadHintVideoChange = async e => {
    await setHintVideo(e.target.files[0]);
  };

  return (
    <>
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
            marginBottom: '1em',
          }}
          name="basic"
        >
          <Form.Item name={'video'} label="Hint Video">
            <input
              type="file"
              name="files"
              onChange={onUploadHintVideoChange}
              alt="video"
              style={{
                marginBottom: '1em',
              }}
            />
          </Form.Item>
          <Collapse collapsible={isValidFile(hintVideo) ? '' : 'disabled'}>
            <Collapse.Panel header="Hint Video" key="1">
              {isValidFile(hintVideo) && (
                <Player
                  fluid
                  src={hintVideo instanceof File ? URL.createObjectURL(hintVideo) : hintVideo}
                >
                  <ControlBar autoHide={false} />
                  <BigPlayButton position="center" />
                </Player>
              )}
            </Collapse.Panel>
          </Collapse>
        </Form>
      </Row>
    </>
  );
};

export default connect(({ lectures, loading }) => ({
  lectures: lectures,
  loading: loading.models.lectures,
}))(HintVideo);
