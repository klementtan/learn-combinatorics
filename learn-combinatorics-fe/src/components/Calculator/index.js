import React, { useState } from 'react';

import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Form,
  InputNumber,
  Input,
  Dropdown,
  Menu,
  Select,
} from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as CalculatorSVG } from '@/assets/calculator.svg';
import { parseKatex } from '@/utils/Katex';
const operators = (
  <Menu defaultOpenKeys={['+']}>
    <Menu.Item key="+">{parseKatex('$+$')}</Menu.Item>
    <Menu.Item key="-">{parseKatex('$-$')}</Menu.Item>
    <Menu.Item key="times">{parseKatex(String.raw`$\times$`)}</Menu.Item>
    <Menu.Item key="div">{parseKatex(String.raw`$\div$`)}</Menu.Item>
    <Menu.Item key="P">{parseKatex('$P$')}</Menu.Item>
    <Menu.Item key="C">{parseKatex('$C$')}</Menu.Item>
  </Menu>
);

const Calculator = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operandA, setOperandA] = useState(0);

  const [operandB, setOperandB] = useState(0);
  const [operator, setOperator] = useState('+');
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const evaluateOperation = () => {
    if (operator === '+') {
      return parseKatex('$' + (parseFloat(operandA) + parseFloat(operandB)) + '$');
    } else if (operator === '-') {
      return parseKatex('$' + (parseFloat(operandA) - parseFloat(operandB)) + '$');
    } else if (operator === '*') {
      return parseKatex('$' + parseFloat(operandA) * parseFloat(operandB) + '$');
    } else if (operator === '/') {
      if (parseFloat(operandB) === 0) {
        return <div>Division by zero</div>;
      }
      return parseKatex('$' + parseFloat(operandA) / parseFloat(operandB) + '$');
    } else if (operator === 'C') {
      var n = parseInt(operandB);
      var K = parseInt(operandA);
      var ans = 1;
      while (n > 0) {
        ans = (ans * K) / n;
        n -= 1;
        K -= 1;
      }
      return parseKatex('$' + ans + '$');
    } else if (operator === 'P') {
      var n = parseInt(operandB);
      var ans = 1;
      var K = parseInt(operandA);
      while (n > 0) {
        ans = ans * K;
        K -= 1;
        n -= 1;
      }
      return parseKatex('$' + ans + '$');
    } else if (operator === '!') {
      var n = parseInt(operandA);
      var ans = 1;
      while (n > 0) {
        ans *= n;
        n -= 1;
      }
      return parseKatex('$' + ans + '$');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Button
        icon={<Icon width={'100%'} height={'100%'} component={CalculatorSVG} />}
        onClick={() => showModal()}
      >
        Calculator
      </Button>
      <Modal title="Calculator" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form>
          <Row gutter={10}>
            <Col span={5}>
              <Form.Item>
                <InputNumber value={operandA} onChange={value => setOperandA(value)} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item rules={[{ required: true }]}>
                <Select value={operator} onChange={val => setOperator(val)}>
                  <Select.Option key="+" value={'+'}>
                    {parseKatex('$+$')}
                  </Select.Option>
                  <Select.Option key="-" value={'-'}>
                    {parseKatex('$-$')}
                  </Select.Option>
                  <Select.Option key="times" value={'*'}>
                    {parseKatex(String.raw`$\times$`)}
                  </Select.Option>
                  <Select.Option key="div" value={'/'}>
                    {parseKatex(String.raw`$\div$`)}
                  </Select.Option>
                  <Select.Option key="P" value={'P'}>
                    {parseKatex('$P$')}
                  </Select.Option>
                  <Select.Option key="C" value={'C'}>
                    {parseKatex('$C$')}
                  </Select.Option>
                  <Select.Option key="!" value={'!'}>
                    {parseKatex('$!$')}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {operator !== '!' && (
              <Col span={5}>
                <Form.Item>
                  <InputNumber value={operandB} onChange={value => setOperandB(value)} />
                </Form.Item>
              </Col>
            )}
            <Col span={4}>{parseKatex('$=$')}</Col>
            <Col>{evaluateOperation()}</Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default Calculator;
