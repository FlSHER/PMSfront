import { Toast } from 'antd-mobile';
import {
  recordBuckle, getAuditList,
  buckleReject,
  getBuckleDetail, withdrawBuckle, firstApprove, finalApprove,
} from '../services/buckle';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'buckle',
  state: {
    selectStaff: [],
    info: {
      executedAt: new Date(),
      description: '',
      participants: [],
    },
    logList: {

    },
    auditList: {},
    detail: {},
    used: false,
  },
  effects: {

    *finalApprove({ payload }, { call }) {
      const response = yield call(finalApprove, payload.data);
      if (response && !response.error) {
        Toast.success(response.message);
        payload.cb();
      }
    },
    *firstApprove({ payload }, { call }) {
      const response = yield call(firstApprove, payload.data);
      if (response && !response.error) {
        Toast.success(response.message);
        payload.cb();
      }
    },
    *withdrawBuckle({ payload }, { call }) {
      const response = yield call(withdrawBuckle, payload.id);
      if (response && !response.error) {
        Toast.success(response.message);
        payload.cb();
      }
    },
    *buckleReject({ payload }, { call }) {
      const response = yield call(buckleReject, payload.id);
      if (response && !response.error) {
        Toast.success(response.message);
        payload.cb();
      }
    },

    *recordBuckle({ payload }, { call }) {
      const response = yield call(recordBuckle, payload.data);
      if (response && !response.error) {
        Toast.success(response.message);
        if (payload.cb) {
          payload.cb();
        }
      }
    },
    *getAuditList({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getAuditList, newPayload);
      if (response && !response.error) {
        yield put({
          type: 'saveList',
          payload: {
            key: 'auditList',
            type: payload.type,
            value: response,
          },
        });
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
      const response = yield call(getBuckleDetail, payload.eventId);
      if (response && !response.error) {
        yield put({
          type: 'saveData',
          payload: {
            key: 'detail',
            value: response,
          },
        });
        if (payload.cb) {
          payload.cb(response);
        }
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
      if (info.page !== 1) { // 多页
        const oldData = [...newList[action.payload.type].data];
        oldData.push(info);
        newList[action.payload.type].data = [...oldData];
      }
      return {
        ...state,
        [action.payload.key]: newList,
      };
    },
  },
};
