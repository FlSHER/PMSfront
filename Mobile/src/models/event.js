import {
  getEvent,
} from '../services/event';
import defaultReducers from './reducers/default';

export default {
  namespace: 'event',
  state: {
    evtAll: [],
    event: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *getEvent(_, { put, call }) {
      const response = yield call(getEvent);
      yield put({
        type: 'save',
        payload: {
          store: 'evtAll',
          data: response || [],
        },
      });
    },
  },

  reducers: {
    ...defaultReducers,
    saveSelectEvent(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,

      };
    },
  },

};
