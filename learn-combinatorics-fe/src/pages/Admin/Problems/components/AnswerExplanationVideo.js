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
import {isValidFile} from "@/utils/utils";

const AnswerExplanationVideo = props => {
  const { explanationVideo, setExplanationVideo } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFraction, setIsFraction] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);


  const onUploadExplanationVideoChange = async e => {
    await setExplanationVideo(e.target.files[0]);
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
          <Form.Item name={'video'} label="Explanation Video">
            <input
              type="file"
              name="files"
              onChange={onUploadExplanationVideoChange}
              alt="video"
              style={{
                marginBottom: '1em',
              }}
            />
          </Form.Item>
          <Collapse
            collapsible={isValidFile(explanationVideo) ? '' : 'disabled'}
          >
            <Collapse.Panel header="Explanation Video" key="1">
              {isValidFile(explanationVideo)&& (
                <Player
                  fluid
                  src={
                    explanationVideo instanceof File
                      ? URL.createObjectURL(explanationVideo)
                      : explanationVideo
                  }
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
}))(AnswerExplanationVideo);
