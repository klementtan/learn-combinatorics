import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import { Card, Row, Col, Avatar, Button, Form, Input, Divider } from 'antd';
import AvatarUploader from './components/AvatarUploader';
import NusEmailVerification from './components/NusEmailVerification';

const Profile = props => {
  console.log('profile props', props);
  const { user, loading } = props;
  const { currentUser } = user;
  const onFinish = async user => {
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'user/updateCurrent',
        user: user,
      });
    }
  };
  const onFinishFailed = values => {};
  return (
    <div key={'user_profile'}>
      <Card>
        <Row justify={'center'}>
          <Col>
            <AvatarUploader avatarUrl={currentUser.avatar_url} />
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '1em',
          }}
          justify={'center'}
        >
          <Col>
            <Form
              name="basic"
              initialValues={{
                name: currentUser.name,
                primary_email: currentUser.primary_email,
                nus_email: currentUser.nus_email,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Primary Email" name="primary_email">
                <Input disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save
                </Button>
              </Form.Item>
            </Form>
            <Divider plain>Verify NUS email</Divider>
            <NusEmailVerification />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user,
}))(Profile);