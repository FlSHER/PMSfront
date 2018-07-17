import { Toast } from 'antd-mobile';
import {
  pointStatistic,
} from '../services/statistic';
import defaultReducers from './reducers/default';

export default {
  namespace: 'statistic',
  state: {
    data: {
      monthly: {},
      trend: [],
    },
  },
  effects: {
    *pointStatistic({ payload }, { call, put }) {
      const response = yield call(pointStatistic, payload);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'data',
            data: response,
          },
        });
      } else {
        Toast.fail(response.message);
      }
    },

  },
  reducers: {
    ...defaultReducers,
  },
};
