import { fetchFinalStaff } from '../../services/event';

const store = 'finalStaff';

export default {
  * fetchFinalStaff(_, { call, put }) {
    try {
      const response = yield call(fetchFinalStaff);
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
