import { fetchEvent } from '../../services/event';

const store = 'event';

export default {
  * fetchEvent({ payload, callBack }, { call, put }) {
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
      if (callBack) {
        callBack(response[0]);
      }
    } catch (err) { return err; }
  },
};
