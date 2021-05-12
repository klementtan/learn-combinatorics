import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage, connect } from 'umi';
import styles from './Welcome.less';

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Settings = (props) => {
  const intl = useIntl();
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
  return (
    <PageContainer>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: '更快更强的重型组件，已经发布。',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="高级表格" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="高级布局" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
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
