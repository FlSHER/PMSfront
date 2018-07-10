import { Toast } from 'antd-mobile';
import {
  getPointDetail,
  getPointLog,
} from '../services/point';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'point',
  state: {
    pointDetails: {},
    pointList: {},
  },
  effects: {
    *getPointDetail({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(getPointDetail, id);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'point',
            id,
            data: response,
          },
        });
      } else {
        Toast.fail(response.message);
      }
    },
    *getPointLog({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getPointLog, newPayload);
      if (response && !response.error) {
        yield put({
          type: 'saveList',
          payload: {
            store: 'pointList',
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
    saveData(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,
      };
    },
    saveList(state, action) {
      const info = action.payload.value;
      const newList = { ...state[action.payload.key] };
      if (info.page !== 1) { // 多页
        let newData = [...newList[action.payload.type].data];
        newData = newData.concat(info.data);
        newList[action.payload.type] = { ...info, data: newData };
      } else {
        newList[action.payload.type] = { ...info };
      }
      return {
        ...state,
        [action.payload.key]: newList,
      };
    },
  },
};
