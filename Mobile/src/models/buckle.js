import { Toast } from 'antd-mobile';
import {
  recordBuckle, getAuditList, getBuckleDetail,
} from '../services/buckle';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'buckle',
  state: {
    selectStaff: [],
    info: {},
    logList: {

    },
    detail: {},
  },
  effects: {
    *recordBuckle({ payload }, { call }) {
      const response = yield call(recordBuckle, payload);
      if (response && !response.error) {
        Toast.success(response.message);
      }
    },
    *getAuditList({ payload }, { call }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getAuditList, newPayload);
      if (response && !response.error) {
        Toast.success(response.message);
      }
    },
    *getLogsList({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getAuditList, newPayload);
      if (response && !response.error) {
        yield put({
          type: 'saveList',
          payload: {
            key: 'logList',
            type: payload.type,
            value: response,
          },
        });
      }
    },
    *getBuckleDetail({ payload }, { call, put }) {
      const response = yield call(getBuckleDetail, payload);
      if (response && !response.error) {
        yield put({
          type: 'saveData',
          payload: {
            key: 'detail',
            value: response,
          },
        });
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
      newList[action.payload.type] = { ...info };
      if (info.page !== 1) {
        const oldData = [...newList[action.payload.type].data];
        oldData.push(info);
        newList[action.payload.type].data = [...oldData];
      }
      // console.log(newList);
      return {
        ...state,
        [action.payload.key]: newList,
      };
    },
  },
};
