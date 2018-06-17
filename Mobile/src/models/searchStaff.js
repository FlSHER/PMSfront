import {
  department,
  getStaff,
  firstDepartment,
  serachStaff,
} from '../services/department';
import defaultReducers from './reducers/default';

export default {
  namespace: 'searchStaff',
  state: {
    department: [],
    staff: [],
    breadCrumb: [],
    pageInfo: {
      page: '',
      totalpage: '',
    },
  },
  effects: {
    * fetchSearchStaff({ payload }, { put, call }) {
      const { parentId, breadCrumb } = payload;
      const response = yield call(department, parentId);
      const { children, staff } = response;
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: staff,
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
          data: children,
        },
      });
    },
    *fetchSelfDepStaff({ payload }, { put, call }) { // 自己部门员工列表
      const { departmentId } = payload;
      const response = yield call(getStaff, departmentId);
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: response || [],
        },
      });
    },
    *fetchFirstDepartment(payload, { put, call }) { // 一级部门列表
      const response = yield call(firstDepartment);
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data: response || [],
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: [],
        },
      });
    },
    *serachStaff({ payload }, { put, call }) { // 一级部门列表
      const response = yield call(serachStaff, payload);
      const { data, page, totalpage } = response;
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data: [],
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'pageInfo',
          data: { page, totalpage },
        },
      });
    },
  },
  reducers: {
    ...defaultReducers,
  },
};
