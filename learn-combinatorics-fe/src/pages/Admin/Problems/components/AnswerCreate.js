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

const AnswerCreate = props => {
  const { answer, setAnswer } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFraction, setIsFraction] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }
  var decimalToFraction = function(_decimal) {
    if (_decimal == parseInt(_decimal)) {
      return {
        top: parseInt(_decimal),
        bottom: 1,
        display: parseInt(_decimal) + '/' + 1,
      };
    } else {
      var top = _decimal.toString().includes('.') ? _decimal.toString().replace(/\d+[.]/, '') : 0;
      var bottom = Math.pow(10, top.toString().replace('-', '').length);
      if (_decimal >= 1) {
        top = +top + Math.floor(_decimal) * bottom;
      } else if (_decimal <= -1) {
        top = +top + Math.ceil(_decimal) * bottom;
      }

      var x = Math.abs(gcd(top, bottom));
      return {
        top: top / x,
        bottom: bottom / x,
        display: top / x + '/' + bottom / x,
      };
    }
  };
  const onDecimalChange = e => {
    const frac = decimalToFraction(e.target.value);
    setAnswer({
      ...answer,
      answer_value_denominator: frac.bottom,
      answer_value_numerator: frac.top,
    });
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
          <Form.Item label={'Select type of answer'}>
            <Radio.Group onChange={e => setIsFraction(e.target.value)} value={isFraction}>
              <Radio value={true}>Fraction</Radio>
              <Radio value={false}>Decimal</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item required label={'Answer(Numerator)'}>
            <Input
              type={'number'}
              value={answer?.answer_value_numerator}
              disabled={!isFraction}
              onChange={e => setAnswer({ ...answer, answer_value_numerator: e.target.value })}
            />
          </Form.Item>
          <Form.Item label={'Answer(Denominator)'} required>
            <Input
              type={'number'}
              disabled={!isFraction}
              value={answer?.answer_value_denominator}
              onChange={e => setAnswer({ ...answer, answer_value_denominator: e.target.value })}
            />
          </Form.Item>

          <Form.Item label={'Answer(Decimal)'} required>
            <Input
              value={answer.answer_value_numerator / answer.answer_value_denominator}
              type={'number'}
              disabled={isFraction}
              onChange={onDecimalChange}
            />
          </Form.Item>

          <Typography.Text strong>
            One of "Explanation body", "Explanation body pdf", "Explanation Video" is required
          </Typography.Text>
          <Form.Item
            label="Explanation Body"
            rules={[{ required: true, message: 'Please input title of problem' }]}
          >
            {previewMode ? (
              <Typography.Paragraph>{parseKatex(answer.explanation_body)}</Typography.Paragraph>
            ) : (
              <Input.TextArea
                rows={4}
                placeholder="Problem Body"
                value={answer?.explanation_body}
                onChange={e =>
                  setAnswer({
                    ...answer,
                    explanation_body: e.target.value,
                  })
                }
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
}))(AnswerCreate);
