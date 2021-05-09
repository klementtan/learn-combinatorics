import { Tag, Button, Form, InputNumber, Radio, Input, Row, Col, Card } from 'antd';
import React, { useContext, useState } from 'react';
import SubmissionConfirmationModal from './AnswerSubmissionModal';
import Calculator from '@/components/Calculator';

const AnswerSubmission = props => {
  const [submissionFormat, setSubmissionFormat] = useState('decimal');
  const [submission, setSubmission] = useState({
    submission: {
      submission_value_numerator: 0,
      submission_value_denominator: 1,
    },
  });

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

  const handleChange = e => {
    const key = Object.keys(e)[0];
    if (key === 'submissionFormat') {
      setSubmissionFormat(e.submissionFormat);
    } else if (key === 'submission_value') {
      const fraction = decimalToFraction(e[key]);
      setSubmission({
        submission: {
          submission_value_numerator: fraction.top,
          submission_value_denominator: fraction.bottom,
        },
      });
    } else {
      setSubmission({
        submission: {
          ...submission.submission,
          [key]: e[key],
        },
      });
    }
  };

  return (
    <Card
      style={{
        width: '100%',
        marginTop: '1em',
        marginBottom: '1em',
      }}
    >
      <Form
        style={{
          width: '100%',
        }}
        onValuesChange={handleChange}
        layout="inline"
        initialValues={{
          submissionFormat: submissionFormat,
        }}
      >
        <Row justify={'center'}>
          <Col>
            <Form.Item
              style={{
                marginTop: '1em',
              }}
            >
              <Calculator />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name={'submissionFormat'}
              style={{
                marginTop: '1em',
              }}
            >
              <Radio.Group>
                <Radio value="fraction">Fraction</Radio>
                <Radio value="decimal">Decimal</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            {submissionFormat === 'fraction' ? (
              <Row>
                <Col>
                  <Form.Item
                    style={{
                      marginTop: '1em',
                    }}
                    name={'submission_value_numerator'}
                    label="Numerator"
                  >
                    <InputNumber />
                  </Form.Item>
                </Col>

                <Col>
                  {' '}
                  <Form.Item
                    style={{
                      marginTop: '1em',
                    }}
                  >
                    /
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    style={{
                      marginTop: '1em',
                    }}
                    name={'submission_value_denominator'}
                    label="Denominator"
                  >
                    <InputNumber />
                  </Form.Item>
                </Col>
              </Row>
            ) : (
              <Form.Item
                style={{
                  marginTop: '1em',
                }}
                name={'submission_value'}
              >
                <Input />
              </Form.Item>
            )}
          </Col>
          <Col>
            <Form.Item
              style={{
                marginTop: '1em',
              }}
            >
              {<SubmissionConfirmationModal submission={submission} />}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
export default AnswerSubmission;
