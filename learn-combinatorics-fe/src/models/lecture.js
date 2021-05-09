import { getAllLectures } from '@/services/lecture';

const LectureModel = {
  namespace: 'lectures',
  state: [],
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getAllLectures());
      yield put({
        type: 'saveLectures',
        payload: response,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'saveLectures',
        payload: [],
      });
    },
  },
  reducers: {
    saveLectures(state, action) {
      return action.payload.lectures || [];
    },
  },
};
export default LectureModel;
