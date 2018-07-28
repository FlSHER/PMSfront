import { Toast } from 'antd-mobile';
import {
  recordBuckle,
  buckleReject,
  getBuckleDetail,
  withdrawBuckle,
  firstApprove,
  finalApprove,
  getLogsList,
  getLogsGroupList,
  getLogGroupDetail,
  getAuditList2,
} from '../services/buckle';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'buckle',
  state: {
    // selectStaff: [],
    info: {
      executedAt: new Date(),
      description: '',
      participants: [],
    },
    infos: {

    },
    selectStaff: {
      first: [],
      final: [],
      participants: [],
      copy: [],
    },
    optAll: {
      pointA: '',
      pointB: '',
      count: 1,
    },
    logList: {

    },
    auditList: {},
    detail: {},
    buckleDetails: {},
    groupDetails: {},
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
      const response = yield call(buckleReject, payload.data);
      if (response && !response.error) {
        Toast.success(response.message);
        payload.cb();
      }
    },

    *recordBuckle({ payload }, { call }) {
      const response = yield call(recordBuckle, payload.data);
      if (response && !response.error) {
        // Toast.success(response.message, 1, () => {
        if (payload.cb) {
          payload.cb();
        }
        // });
      }
    },
    *getAuditList({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getLogsGroupList, newPayload);
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
    *getAuditList2({ payload }, { call, put }) {
      // const newPayload = makerFilters(payload);
      const response = yield call(getAuditList2, payload.url);
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
      const response = yield call(getLogsList, newPayload);
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

    *getLogsGroupList({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getLogsGroupList, newPayload);
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

    *getLogGroupDetail({ payload }, { call, put }) {
      const response = yield call(getLogGroupDetail, payload.eventId);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'group',
            id: response.id,
            data: response,
          },
        });
        if (payload.cb) {
          payload.cb(response);
        }
      }
    },
    *getBuckleDetail({ payload }, { call, put }) {
      const response = yield call(getBuckleDetail, payload.eventId);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'buckle',
            id: response.id,
            data: response,
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
      const info = { ...action.payload.value };
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
    clearModal(state) {
      const newState = {
        info: {
          executedAt: new Date(),
          description: '',
          participants: [],
        },
        optAll: {
          pointA: '',
          pointB: '',
          count: '',
        },
      };
      return {
        ...state,
        ...newState,
      };
    },
  },
};
