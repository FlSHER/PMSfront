import { fetchFinalStaff } from '../../services/event';

const store = 'finalStaff';

export default {
  * fetchFinalStaff({ payload: { update } }, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.event[store]);
      if (!response.length || update) {
        response = yield call(fetchFinalStaff);
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
