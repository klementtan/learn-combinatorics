import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeGoogleAuth',
        payload: payload.tokenObj.id_token,
      }); // Login successfull
      localStorage.setItem('learn-combinatorics-token', payload.tokenObj.id_token);
    },

    *logout({ payload }, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      yield put({
        type: 'changeGoogleAuth',
        payload: '',
      });
        history.replace({
          pathname: '/user/login',
        });
        localStorage.setItem('learn-combinatorics-token', '');
    },
  },
  reducers: {
    changeGoogleAuth(state, { payload }) {
      console.log('Setting redux', payload);
      return { ...state, googleIdToken: payload };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
