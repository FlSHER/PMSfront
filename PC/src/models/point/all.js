import { fetchAccumulative } from '../../services/point';

const store = 'accumulative';

export default {
  * fetchAccumulative({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      const key = JSON.stringify(params);
      let response;
      response = yield select(model => model.point[store][key]);
      if (!response) response = yield call(fetchAccumulative, params);
      yield put({
        type: 'saveKey',
        payload: {
          store,
          key,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
  * fetchStaffCount({ payload }, { call, put, select }) {
    try {
      const params = { ...payload };
      let response;
      response = yield select(model => model.point[`${store}Staff`][params.staff_sn]);
      if (!response) response = yield call(fetchAccumulative, params);
      yield put({
        type: 'saveKey',
        payload: {
          store: `${store}Staff`,
          key: params.staff_sn,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
