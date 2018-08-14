import { fetchMyPoint } from '../../services/point';

const store = 'me';

export default {
  * fetchMyPoint({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      const { datetime } = params;
      let response;
      response = yield select(model => model.point[store][datetime]);
      if (!response) response = yield call(fetchMyPoint, params);
      yield put({
        type: 'saveMyPoint',
        payload: {
          store,
          datetime,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
