import React, {useState} from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect, history} from 'umi';
import { stringify } from 'querystring';
import {GoogleLogin, useGoogleLogin} from 'react-google-login'
import styles from "@/pages/User/login/index.less";

const SecurityLayout = (props) => {
  const [isReady, setIsReady] = useState(false)
  const fetchCurrentUser = async values => {
    setIsReady(false)
    const { dispatch } = props;
    if (dispatch) {
      await dispatch({
        type: 'login/login',
        payload: { ...values },
      });
      await dispatch({
        type: 'user/fetchCurrent',
      });
    }
    setIsReady(true)
  }

  useGoogleLogin({
    clientId:REACT_APP_GOOGLE_CLIENT_ID,
    isSignedIn:true,
    onFailure: () => history.push("/user/login"),
    onSuccess:fetchCurrentUser
  })



  const { children, loginLoading, userLoading, currentUser } = props; // You can replace it to your authentication rule (such as check token exists)
  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

  const isLogin = currentUser && currentUser.id;

  if ((!isLogin && loginLoading) ||(!isLogin && userLoading) || !isReady) {
    return <PageLoading />;
  }

  if (isReady && !isLogin && window.location.pathname !== '/user/login') {
    return <Redirect to={`/user/login?action=logout`} />;
  }

  return children;
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loginLoading: loading.models.login,
  userLoading: loading.models.user,
}))(SecurityLayout);
