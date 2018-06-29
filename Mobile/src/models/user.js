import { Toast } from 'antd-mobile';
import {
  getUserInfo,
} from '../services/user';
import defaultReducers from './reducers/default';
// import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'user',
  state: {
    userInfo: {},
  },
  effects: {
    *getUserInfo(payload, { call, put }) {
      if (localStorage.userInfo) {
        return;
      }
      const response = yield call(getUserInfo);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'userInfo',
            data: response,
          },
        });
        localStorage.userInfo = JSON.stringify(response);
      } else {
        Toast.fail(response.message);
      }
    },


  },
  reducers: {
    ...defaultReducers,
  },
};
