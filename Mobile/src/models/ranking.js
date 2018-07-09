import { Toast } from 'antd-mobile';
import {
  getRanking,
  getAuthorityGroup,
  getStatiRanking,
} from '../services/ranking';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'ranking',
  state: {
    group: {},
    ranking: {},
    optRanking: {},
  },
  effects: {
    *getAuthorityGroup(_, { call, put, select }) {
      const { group } = yield select(v => v.ranking);
      if (group && group.length) { return; }
      const response = yield call(getAuthorityGroup);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'group',
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
          type: 'save',
          payload: {
            store: 'pointList',
            data: response,
          },
        });
      } else {
        Toast.fail(response.message);
      }
    },

    *getRanking({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getRanking, newPayload);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'ranking',
            data: response,
          },
        });
      } else {
        Toast.fail(response.message);
      }
    },
    *getStatiRanking({ payload }, { call, put }) {
      const newPayload = makerFilters(payload);
      const response = yield call(getStatiRanking, newPayload);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'optRanking',
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
        newList[action.payload.type].data = [...newData];
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
