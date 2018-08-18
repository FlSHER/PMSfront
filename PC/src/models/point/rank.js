
import { fetchRank } from '../../services/point';

const store = 'rank';

export default {
  * fetchRank({ payload, update }, { call, put, select }) {
    try {
      let response;
      const params = { ...payload };
      response = yield select(model => model.point[`${store}Details`][JSON.stringify(params)]);
      if (!response || update) {
        response = yield call(fetchRank, params);
        yield put({
          type: 'save',
          payload: {
            store,
            id: JSON.stringify(params),
            data: response,
          },
        });
      }
    } catch (err) { return err; }
  },
};
