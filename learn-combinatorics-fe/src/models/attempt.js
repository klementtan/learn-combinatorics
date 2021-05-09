import { getOrCreateAttempt, getAttemptById } from '@/services/attempt';

const AttemptModel = {
  namespace: 'attempt',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getOrCreateAttempt(payload));
      yield put({
        type: 'saveAttempt',
        payload: response,
      });
    },
    *fetchByAttemptId({ payload }, { call, put }) {
      const response = yield call(() => getAttemptById(payload));
      yield put({
        type: 'saveAttempt',
        payload: response,
      });
    },
    *clear({ payload }, { call, put }) {
      yield put({
        type: 'saveAttempt',
        payload: {},
      });
    },
  },
  reducers: {
    saveAttempt(state, action) {
      return { ...(action.payload.attempt || {}) };
    },
  },
};
export default AttemptModel;
