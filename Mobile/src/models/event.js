import {
  getEvent,
} from '../services/event';
import defaultReducers from './reducers/default';

export default {
  namespace: 'event',
  state: {
    evtAll: [],
    event: {},
    breadCrumb: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getEvent({ payload }, { put, call }) {
      const { breadCrumb } = payload;
      const response = yield call(getEvent);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'evtAll',
            data: response || [],
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'breadCrumb',
            data: breadCrumb,
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
  },

};
