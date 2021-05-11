import {connect} from "umi";
import {PageContainer} from "@ant-design/pro-layout";
import React from "react";
import { Card, Row, Col ,Avatar, Button, Form, Input, Divider } from 'antd';
import {LoadingOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons'
import AvatarUploader from "./components/AvatarUploader";
import NusEmailVerification from "@/pages/Profile/components/NusEmailVerification";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class AvatarUploader extends React.Component {
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <Avatar
        size={240}
        src={this.props.avatarUrl}
      />
    );
  }
}
const Profile = (props) => {
  console.log("profile props", props)
  const { user, loading} = props
  const { currentUser } = user
  const onFinish = async (user) => {
    const {dispatch} = props
    if (dispatch) {
      await dispatch({
        type: 'user/updateCurrent',
        user: user
      });
    }
  }
  const onFinishFailed = (values) => {
  }
  return(
    <PageContainer>
      {/*<Card>*/}
      {/*  <Row*/}
      {/*    justify={"center"}*/}
      {/*  >*/}
      {/*    <Col>*/}
      {/*      <AvatarUploader*/}
      {/*        avatarUrl={currentUser.avatar_url}*/}
      {/*      />*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*  <Row*/}
      {/*    style={{*/}
      {/*      marginTop:"1em"*/}
      {/*    }}*/}
      {/*    justify={"center"}*/}
      {/*  >*/}
      {/*    <Col>*/}
      {/*      <Form*/}
      {/*        {...layout}*/}
      {/*        name="basic"*/}
      {/*        initialValues={{ name: currentUser.name, primary_email: currentUser.primary_email, nus_email:currentUser.nus_email }}*/}
      {/*        onFinish={onFinish}*/}
      {/*        onFinishFailed={onFinishFailed}*/}
      {/*      >*/}
      {/*        <Form.Item*/}
      {/*          label="Name"*/}
      {/*          name="name"*/}
      {/*          rules={[{ required: true, message: 'Please input your name!' }]}*/}
      {/*        >*/}
      {/*          <Input />*/}
      {/*        </Form.Item>*/}

      {/*        <Form.Item*/}
      {/*          label="Primary Email"*/}
      {/*          name="primary_email"*/}
      {/*        >*/}
      {/*          <Input*/}
      {/*            disabled*/}
      {/*          />*/}
      {/*        </Form.Item>*/}
      {/*        <Form.Item {...tailLayout}>*/}
      {/*          <Button type="primary" htmlType="submit" loading={loading}>*/}
      {/*           Save*/}
      {/*          </Button>*/}
      {/*        </Form.Item>*/}
      {/*      </Form>*/}
      {/*      <Divider plain>Verify NUS email</Divider>*/}
      {/*        <NusEmailVerification/>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Card>*/}
      foo
    </PageContainer>
  )
}

export default connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user,
}))(Profile);

