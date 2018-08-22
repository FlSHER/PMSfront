import { fetchMyPoint } from '../../services/point';

const store = 'me';

export default {
  * fetchMyPoint({ payload, update }, { call, put, select }) {
    try {
      const params = { ...payload };
      let response;
      response = yield select(model => model.point[store][JSON.stringify(params)]);
      if (!response || update) response = yield call(fetchMyPoint, params);
      yield put({
        type: 'saveKey',
        payload: {
          store,
          key: JSON.stringify(params),
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
