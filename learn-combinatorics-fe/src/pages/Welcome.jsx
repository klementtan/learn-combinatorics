import React, {useEffect, useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert,Row, Form, Input,Divider, Col, Button ,Typography } from 'antd';
import { useIntl, FormattedMessage, connect } from 'umi';
import styles from './Welcome.less';
import NusEmailVerification from "@/components/Settings/NusEmailVerification";
import ErrorBoundary from "@/components/ErrorBoundary"
import {updateProfile} from "@/services/user";

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Settings = (props) => {
    console.log('profile props', props);
  const { user, loading } = props;
  const { currentUser } = user;
  const [currUser, setCurrUser] = useState({})
  const onFinish = async user => {
    await updateProfile(user)
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'user/updateCurrent',
        user: user,
      });
    }
  };
  useEffect(() => {
    if (JSON.stringify(currUser) !== JSON.stringify({}))  return;
    if (currentUser) setCurrUser({
      name: currentUser.name,
      primary_email: currentUser.primary_email,
    })
  })
  console.log(currUser)
  return (
      <PageContainer>
        <Card>
          <Row
            style={{
              marginTop: '1em',
            }}
            justify={'center'}
          >
            <Col>
              <Form
                name={"userprofile"}
              >
                <Form.Item
                  label="Name"
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input
                    value={currUser.name}
                    onChange={e => setCurrUser({...currUser, name: e.target.value})}
                  />
                </Form.Item>

                <Form.Item label="Primary Email" >
                  <Input disabled
                         value={currUser.primary_email}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={onFinish} loading={loading}>
                    Save
                  </Button>
                </Form.Item>
              </Form>
              <Divider plain>Verify NUS email</Divider>
              <NusEmailVerification />
            </Col>
          </Row>
        </Card>
      </PageContainer>
  );
};
export default connect(({ user, loading }) => ({
  user: user,
  loading: loading.models.user,
}))(Settings);

// import { connect } from 'umi';
// import { PageContainer } from '@ant-design/pro-layout';
// import React from 'react';
// import { Card, Row, Col, Avatar, Button, Form, Input, Divider } from 'antd';
// import AvatarUploader from '../../components/Settings/AvatarUploader';
// import NusEmailVerification from '../../components/Settings/NusEmailVerification';
//
// const Settings = props => {
//   console.log('profile props', props);
//   const { user, loading } = props;
//   const { currentUser } = user;
//   const onFinish = async user => {
//     await updateProfile(user)
//     const { dispatch } = props;
//     if (dispatch) {
//       await dispatch({
//         type: 'user/updateCurrent',
//         user: user,
//       });
//     }
//   };
//   const onFinishFailed = values => {};
//   return (
//     <PageContainer>
//       <Card>
//         <Row justify={'center'}>
//           <Col>
//             <AvatarUploader avatarUrl={currentUser.avatar_url} />
//           </Col>
//         </Row>
//         <Row
//           style={{
//             marginTop: '1em',
//           }}
//           justify={'center'}
//         >
//           <Col>
//             <Form
//               name="basic"
//               initialValues={{
//                 name: currentUser.name,
//                 primary_email: currentUser.primary_email,
//                 nus_email: currentUser.nus_email,
//               }}
//               onFinish={onFinish}
//               onFinishFailed={onFinishFailed}
//             >
//               <Form.Item
//                 label="Name"
//                 name="name"
//                 rules={[{ required: true, message: 'Please input your name!' }]}
//               >
//                 <Input />
//               </Form.Item>
//
//               <Form.Item label="Primary Email" name="primary_email">
//                 <Input disabled />
//               </Form.Item>
//               <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                   Save
//                 </Button>
//               </Form.Item>
//             </Form>
//             <Divider plain>Verify NUS email</Divider>
//             <NusEmailVerification />
//           </Col>
//         </Row>
//       </Card>
//     </PageContainer>
//   );
// };
//
// export default connect(({ user, loading }) => ({
//   user: user,
//   loading: loading.models.user,
// }))(Settings);
