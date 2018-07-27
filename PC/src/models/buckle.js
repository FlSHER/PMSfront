import {
  fetchBuckle,
  fetchBuckleGroups,
  addBuckle,
  firstCheck,
  finalCheck,
  reject,
} from '../services/buckle';
import defaultReducers from './reducers';

export default {
  namespace: 'buckle',
  state: {
    buckleGropus: {},
    buckleGropusDetails: {},
    recorded: {},
    participant: {},
    processing: {},
    approved: {},
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      try {
        const params = { ...payload };
        const { id, type } = params;
        delete params.id;
        const response = yield call(fetchBuckle, params, id || '');
        yield put({
          type: 'save',
          payload: {
            store: type,
            id,
            data: response,
          },
        });
      } catch (err) { return err; }
    },
    *fetchBuckleGroups({ payload }, { call, put }) {
      try {
        const params = { ...payload };
        const { id, type } = params;
        delete params.id;
        const response = yield call(fetchBuckleGroups, params, id || '');
        yield put({
          type: 'save',
          payload: {
            store: type,
            id,
            data: response,
          },
        });
      } catch (err) { return err; }
    },
    *fetchBuckleGroupsInfo({ payload }, { call, put }) {
      try {
        const params = { ...payload };
        const { id } = params;
        delete params.id;
        const response = yield call(fetchBuckleGroups, params, id || '');
        yield put({
          type: 'save',
          payload: {
            store: 'buckleGropus',
            id,
            data: response,
          },
        });
      } catch (err) { return err; }
    },
    * addBuckle({ payload, onSuccess, onError }, { call }) {
      try {
        const params = {
          ...payload,
        };
        const response = yield call(addBuckle, params);
        if (response.errors && onError) {
          onError(response.errors);
        } else {
          onSuccess(response);
        }
      } catch (err) { return err; }
    },
    * approve({ payload, onSuccess, onError }, { call, put }) {
      try {
        const params = {
          ...payload,
        };
        const { id, type } = payload;
        delete params.id;
        delete params.type;
        let response;
        if (type) {
          response = yield call(firstCheck, params, id);
        } else {
          response = yield call(finalCheck, params, id);
        }
        if (response.errors && onError) {
          onError(response.errors);
        } else {
          yield put({
            type: 'approveCheck',
            payload: {
              id,
              data: response,
            },
          });
          onSuccess(response);
        }
      } catch (err) { return err; }
    },
    * reject({ payload, onSuccess, onError }, { call, put }) {
      try {
        const params = {
          ...payload,
        };
        const { id } = payload;
        delete params.id;
        const response = yield call(reject, params, id);
        if (response.errors && onError) {
          onError(response.errors);
        } else {
          yield put({
            type: 'approveCheck',
            payload: {
              id,
              data: response,
            },
          });
          onSuccess(response);
        }
      } catch (err) { return err; }
    },
  },
  reducers: {
    ...defaultReducers,
    approveCheck(state, action) {
      const { id } = action.payload;
      const buckleGropusDetails = { ...state.buckleGropusDetails };
      const proces = { ...state.processing };
      Object.keys(buckleGropusDetails).forEach((key) => {
        if (id === key) {
          delete buckleGropusDetails[key];
        }
      });
      const processing = proces.data.filter(item => item.id !== id);
      return {
        ...state,
        buckleGropusDetails,
        processing: {
          ...proces,
          total: proces.total - 1,
          data: processing,
        },
      };
    },
  },
};
