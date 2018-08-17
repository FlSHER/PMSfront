
import { fetchStaffAuthority } from '../../services/point';

const store = 'staffAuthority';

export default {
  * fetchStaffAuthority(_, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.point[store]);
      if (!Object.keys(response).length) response = yield call(fetchStaffAuthority);
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
