import { getOrCreateAttempt, getAttempts } from '@/services/attempt';

const AttemptsModel = {
  namespace: 'attempts',
  state: [],
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getAttempts());
      yield put({
        type: 'saveAttempts',
        payload: response,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'saveAttempts',
        payload: [],
      });
    },
  },
  reducers: {
    saveAttempts(state, action) {
      return action.payload.attempts || [];
    },
  },
};
export default AttemptsModel;
