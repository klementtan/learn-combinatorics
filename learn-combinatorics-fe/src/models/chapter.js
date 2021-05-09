import { getAllChapters } from '@/services/chapters';

const ChapterModel = {
  namespace: 'chapters',
  state: [],
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(() => getAllChapters());
      yield put({
        type: 'saveChapters',
        payload: response,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'saveChapters',
        payload: [],
      });
    },
  },
  reducers: {
    saveChapters(state, action) {
      return action.payload.chapters || [];
    },
  },
};
export default ChapterModel;
