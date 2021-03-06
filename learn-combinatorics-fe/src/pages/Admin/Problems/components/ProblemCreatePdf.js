import {
  Button,
  Form,
  Tag,
  Input,
  Checkbox,
  Table,
  Space,
  Row,
  Col,
  Typography,
  Collapse,
} from 'antd';
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
import Pdf from '@/components/Pdf';
import { isValidFile } from '@/utils/utils';

const ProblemCreatePdf = props => {
  const { problemPdf, setProblemPdf } = props;
  const onUploadProblemPdfChange = async e => {
    await setProblemPdf(e.target.files[0]);
  };
  return (
    <>
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
          }}
          name="basic"
        >
          <Form.Item name={'pdf'} label="Problem body pdf file">
            <input type="file" name="files" onChange={onUploadProblemPdfChange} alt="image" />
          </Form.Item>
          <Collapse
            style={{
              marginTop: '1em',
            }}
            collapsible={isValidFile(problemPdf) ? '' : 'disabled'}
          >
            <Collapse.Panel header="View PDF" key="1">
              <Pdf pdf={problemPdf} />
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
}))(ProblemCreatePdf);
