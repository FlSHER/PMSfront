import { fetchAccumulative } from '../../services/point';

const store = 'accumulative';

export default {
  * fetchAccumulative(_, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.point[store]);
      if (!Object.keys(response).length) response = yield call(fetchAccumulative);
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
