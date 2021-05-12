import { getAllHints } from '@/services/hints';

const HintModel = {
  namespace: 'hints',
  state: [],
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getAllHints());
      yield put({
        type: 'saveHints',
        payload: response,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'saveHints',
        payload: [],
      });
    },
  },
  reducers: {
    saveHints(state, action) {
      return action.payload.hints || [];
    },
  },
};
export default HintModel;
