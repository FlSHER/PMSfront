import { fetchType } from '../../services/point';

const store = 'type';

export default {
  * fetchType(_, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.point[store]);
      if (!response.length) {
        response = yield call(fetchType);
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
