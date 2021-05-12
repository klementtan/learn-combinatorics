import { getAllProblems } from '@/services/problem';

const ProblemModel = {
  namespace: 'problems',
  state: [],
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getAllProblems());
      yield put({
        type: 'saveProblems',
        payload: response,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'saveProblems',
        payload: [],
      });
    },
  },
  reducers: {
    saveProblems(state, action) {
      return action.payload.problems || [];
    },
  },
};
export default ProblemModel;
