import { queryCurrent, query as queryUsers, updateProfile } from '@/services/user';
import { setAuthority } from '@/utils/authority';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *updateCurrent(user, { call, put }) {
      const response = yield call(() => updateProfile(user));

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      console.log(response)
      yield put({
        type: 'saveCurrentUser',
        payload: response.user,
      });
    },
    *reset(_, { call, put }) {

      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      setAuthority(action.payload.roles);
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
