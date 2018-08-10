import { fetchDetail, fetchDetailInfo } from '../../services/point';

const store = 'pointDetails';

export default {
  * fetchDetail({ payload }, { call, put }) {
    try {
      let response;
      const params = { ...payload };
      const { id } = payload;
      delete params.id;
      if (!id) response = yield call(fetchDetail, params);
      if (id) response = yield call(fetchDetailInfo, id);
      yield put({
        type: 'save',
        payload: {
          store,
          id,
          data: response,
        },
      });
    } catch (err) { return err; }
  },
};
