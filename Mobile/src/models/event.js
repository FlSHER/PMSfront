import {
  getEvent,
  getEventName,
  searchEventName,
} from '../services/event';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util';

export default {
  namespace: 'event',
  state: {
    evtAll: [],
    evtName: [],
    searchEvent: {
      page: '',
      totalpage: '',
      data: [],
    },
    event: {},
    breadCrumb: [],
  },
  subscriptions: {
    setup({ dispatch, history }) { // eslint-disable-line
    },
  },

  effects: {

    * getEvent({ payload }, { select, put, call }) {
      const { breadCrumb } = payload;
      const evtAll = yield select(state => state.event.evtAll);
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: breadCrumb,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'evtName',
          data: [],
        },
      });
      if (!evtAll || evtAll.length === 0) {
        const response = yield call(getEvent);
        if (response && !response.error) {
          yield put({
            type: 'save',
            payload: {
              store: 'evtAll',
              data: response || [],
            },
          });
        }
      }
    },
    * getEventName({ payload }, { put, call }) {
      const response = yield call(getEventName, payload.id);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'evtName',
            data: response || [],
          },
        });
        if (payload.cb) {
          payload.cb();
        }
      }
    },
    * searchEventName({ payload }, { put, call, select }) {
      const newParams = makerFilters(payload);
      const { searchEvent } = yield select(_ => _.event);
      const response = yield call(searchEventName, newParams);
      if (response && !response.error) {
        const { data, page, totalpage } = response;
        let newEvent = null;
        if (page !== 1) {
          const oldData = searchEvent.data;
          const newData = oldData.concat(data);
          newEvent = { data: newData, page, totalpage };
        } else {
          newEvent = { ...response };
        }
        yield put({
          type: 'save',
          payload: {
            store: 'searchEvent',
            data: newEvent,
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
        ...state,
        ...newState,

      };
    },
    clearEvent(state) {
      return {
        ...state,
        event: {},
      };
    },
    clearModal(state) {
      return {
        ...state,
        evtName: [],
        searchEvent: {
          page: '',
          totalpage: '',
          data: [],
        },
        event: {},
        breadCrumb: [],
      };
    },
  },

};
