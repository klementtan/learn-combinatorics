import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, {useEffect, useState} from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, history } from 'umi';
import { getFakeCaptcha } from '@/services/login';
import styles from './index.less';
import {GoogleLogin, useGoogleLogout} from 'react-google-login';
import {parse} from 'querystring'
import qs from 'qs'
const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const responseGoogle = (response) => {
  console.log(response);
};

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('profile');
  const intl = useIntl();
  const {signOut} = useGoogleLogout({
    clientId: REACT_APP_GOOGLE_CLIENT_ID,
    onLogoutSuccess: responseGoogle,
    onFailure: responseGoogle
  })
  const isLoggedOut = qs.parse(props.location.search, { ignoreQueryPrefix: true }).action === 'logout'

  useEffect(()=> {
    if(isLoggedOut){
      handleLogOut()
    }
  }, [])

  const handleSubmit = async (values) => {
    const { dispatch } = props;
    await dispatch({
      type: 'login/login',
      payload: { ...values },
    });

    history.push("/")
  };

  const handleLogOut = async () => {
    signOut()
    const { dispatch } = props;
    await dispatch({
      type: 'login/logout',
      payload: {},
    });

  }
  alert(REACT_APP_GOOGLE_CLIENT_ID)
  return (
    <div className={styles.main}>
      <GoogleLogin
        isSignedIn={!isLoggedOut}
        className={styles.button}
        clientId={REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Login With Google"
        onSuccess={handleSubmit}
        onFailure={responseGoogle}
      />
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
