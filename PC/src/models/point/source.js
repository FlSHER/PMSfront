import { fetchSource } from '../../services/point';

const store = 'source';

export default {
  * fetchSource(_, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.point[store]);
      if (!response.length) {
        response = yield call(fetchSource);
      }
      yield put({
        type: 'save',
        payload: {
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
