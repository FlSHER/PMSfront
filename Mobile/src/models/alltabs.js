import { Toast } from 'antd-mobile';
import {
  pointStatistic,
} from '../services/statistic';
import defaultReducers from './reducers/default';

export default {
  namespace: 'alltabs',
  state: {
    tabs: {
      processing: 'sort=created_at-desc&type=processing',
      approved: 'sort=created_at-desc&type=approved',
      participant: 'sort=created_at-desc&type=participant',
      addressee: 'sort=created_at-desc&type=addressee',
      recorded: 'sort=created_at-desc&type=recorded',
      point: 'sort=created_at-desc',
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
    clearModal(state) {
      return {
        ...state,
        tabs: {
          processing: 'sort=created_at-desc&type=processing',
          approved: 'sort=created_at-desc&type=approved',
          participant: 'sort=created_at-desc&type=participant',
          addressee: 'sort=created_at-desc&type=addressee',
          recorded: 'sort=created_at-desc&type=recorded',
          point: 'sort=created_at-desc',
        },
      };
    },
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
