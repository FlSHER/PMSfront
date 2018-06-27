import {
  department,
  getStaff,
  firstDepartment,
  serachStaff,
  getFinalStaff,
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
    selectStaff: {
      first: [],
      final: [],
      participants: [],
      copy: [],
    },
  },
  effects: {
    *getFinalStaff(_, { put, call }) { // 自己部门员工列表
      const response = yield call(getFinalStaff);
      // console.log('response', response);
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: response || [],
        },
      });
    },
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
    *fetchFirstDepartment({ payload }, { put, call }) { // 一级部门列表
      const { breadCrumb } = payload;
      const response = yield call(firstDepartment);
      if (response && !response.error) {
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
      }
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: breadCrumb,
        },
      });
    },
    *serachStaff({ payload }, { put, call, select }) { // 一级部门列表
      const { staff } = yield select(_ => _.searchStaff);
      const response = yield call(serachStaff, payload);
      const { data, page, totalpage } = response;
      let newStaff = [];
      if (page !== 1) {
        newStaff = [...staff];
        newStaff = staff.concat(data);
      } else {
        newStaff = [...data];
      }
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
          data: newStaff,
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
    saveSelectStaff(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,
      };
    },
  },
};
