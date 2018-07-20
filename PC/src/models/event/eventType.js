import { fetchEventType } from '../../services/event';

const store = 'type';

export default {
  * fetchEventType({ update }, { call, put, select }) {
    try {
      let response;
      response = yield select(model => model.event[store]);
      if (!response.length || update) {
        response = yield call(fetchEventType);
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
