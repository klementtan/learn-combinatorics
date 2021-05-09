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
import { connect, history, Redirect } from 'umi';
import Pdf from '@/components/Pdf';
import {isValidFile} from "@/utils/utils";

const HintPdf = props => {
  const { hintPdf, setHintPdf } = props;
  const onUploadHintPdfChange = async e => {
    await setHintPdf(e.target.files[0]);
  };
  return (
    <>
      <Row justify={'center'}>
        <Form
          style={{
            width: '75%',
            marginBottom: "1em"
          }}
          name="basic"
        >
          <Form.Item name={'pdf'} label="Hint body pdf file">
            <input type="file" name="files" onChange={onUploadHintPdfChange} alt="image" />
          </Form.Item>
          <Collapse
            style={{
              marginTop: '1em',
            }}
            collapsible={ isValidFile(hintPdf) ? '' : 'disabled'}
          >
            <Collapse.Panel header="View PDF" key="1">
              <Pdf pdf={hintPdf} />
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
}))(HintPdf);
