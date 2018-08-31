
import { fetchBasePoint } from '../../services/point';

const store = 'basePoint';

export default {
  * fetchBasePoint({ payload }, { call, put }) {
    try {
      const { id } = payload;
      const response = yield call(fetchBasePoint, id || '');
      yield put({
        type: 'save',
        payload: {
          id,
          store,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
