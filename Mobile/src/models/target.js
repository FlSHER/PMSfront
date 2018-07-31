import { Toast } from 'antd-mobile';
import {
  userTarget,
} from '../services/target';
import defaultReducers from './reducers/default';

export default {
  namespace: 'target',
  state: {
    target: {},
  },
  effects: {
    *getTarget({ payload }, { call, put }) {
      const response = yield call(userTarget, payload);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'target',
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
