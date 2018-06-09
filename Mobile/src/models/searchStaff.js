import {
  department,
  staff,
} from '../services/department';
import defaultReducers from './reducers/default';

export default {
  namespace: 'searchStaff',
  state: {
    department: [],
    staff: [],
    breadCrumb: [],
  },
  effects: {
    * fetchSearchStaff({ payload }, { put, call }) {
      const { parentId, breadCrumb } = payload;
      const response = yield call(department);
      const data = response.filter(item => item.parent_id === parentId);
      let staffResponse = [];
      if (!data.length) {
        staffResponse = yield call(staff);
      }
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: staffResponse,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: breadCrumb,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data,
        },
      });
    },
  },
  reducers: {
    ...defaultReducers,
  },
};
