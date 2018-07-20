import { fetchEvent } from '../../services/event';

const store = 'event';

export default {
  * fetchEvent({ payload }, { call, put }) {
    try {
      const params = { ...payload };
      const response = yield call(fetchEvent, params);
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
