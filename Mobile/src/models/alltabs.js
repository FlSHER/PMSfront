import { Toast } from 'antd-mobile';
import {
  pointStatistic,
} from '../services/statistic';
import defaultReducers from './reducers/default';

export default {
  namespace: 'alltabs',
  state: {
    tabs: {
      processing: 'sort=created_at-desc&type=processing&filters=status_id=1',
      approved: 'sort=created_at-desc&type=approved',
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
    saveKey(state, action) {
      const { tabs } = state;
      const { type, value } = action.payload;
      tabs[type] = value;
      return {
        ...state,
        tabs,
      };
    },
  },
};
