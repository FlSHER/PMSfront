import {
  fetchBuckle,
  addBuckle,
  // withdrawBuckle,
} from '../services/buckle';
import defaultReducers from './reducers';

const store = 'buckle';
export default {
  namespace: 'buckle',
  state: {
    buckle: {},
    recorded: {},
    participant: {},
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
    * addBuckle({ payload, onSuccess, onError }, { call, put }) {
      try {
        const params = {
          ...payload,
        };
        const response = yield call(addBuckle, params);
        if (response.errors && onError) {
          onError(response.errors);
        } else {
          yield put({
            type: 'add',
            payload: {
              store,
              data: response,
            },
          });
          onSuccess(response);
        }
      } catch (err) { return err; }
    },
    // * edit({ payload, onSuccess, onError }, { call, put }) {
    //   try {
    //     const params = {
    //       ...payload,
    //     };
    //     const { id } = payload;
    //     delete params.id;
    //     const response = yield call(editEvent, params, id);
    //     if (response.errors && onError) {
    //       onError(response.errors);
    //     } else {
    //       yield put({
    //         type: 'update',
    //         payload: {
    //           store,
    //           id,
    //           data: response,
    //         },
    //       });
    //       onSuccess(response);
    //     }
    //   } catch (err) { return err; }
    // },
    // * delete({ payload }, { call, put }) {
    //   try {
    //     const { id } = payload;
    //     const response = yield call(deleteEvent, id);
    //     if (response.error) {
    //       notification.error({
    //         message: '删除失败',
    //         description: response.error,
    //       });
    //     } else {
    //       yield put({
    //         type: 'delete',
    //         payload: {
    //           store,
    //           id,
    //         },
    //       });
    //     }
    //   } catch (err) { return err; }
    // },
  },
  reducers: {
    ...defaultReducers,
  },
};
