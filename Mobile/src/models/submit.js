
import moment from 'moment';
import {
  recordBuckle,
} from '../services/buckle';
import { userStorage } from '../utils/util';

const userInfo = userStorage('userInfo');

export default {
  namespace: 'submit',
  state: {
    addressees: [],
    final: null,
    first: {
      staff_sn: userInfo.staff_sn,
      realname: userInfo.realname,
      staff_name: userInfo.realname,
    },
    info: {
      title: '',
      remark: '',
      executed_at: moment(new Date()).format('YYYY-MM-DD'),
    },
  },
  effects: {
    *recordBuckle({ payload }, { call }) {
      const response = yield call(recordBuckle, payload.data);
      if (response && !response.error) {
        if (payload.cb) {
          payload.cb();
        }
      }
    },
  },
  reducers: {
    // ...defaultReducers,
    clearModal(state) {
      return {
        ...state,
        addressees: [],
        final: null,
        first: {
          staff_sn: userInfo.staff_sn,
          realname: userInfo.realname,
          staff_name: userInfo.realname,
        },
        info: {
          title: '',
          remark: '',
          executed_at: moment(new Date()).format('YYYY-MM-DD'),
        },
      };
    },
    saveSubmitInfo(state, action) {
      const { value } = action.payload;
      const addressees = (value.addressees || []).map((_) => {
        const obj = { staff_sn: _.staff_sn, realname: _.realname, staff_name: _.staff_name };
        return obj;
      });
      const final = {
        staff_sn: value.final_approver_sn,
        realname: value.final_approver_name,
        staff_name: value.final_approver_name,
      };
      const first = {
        staff_sn: value.first_approver_sn,
        realname: value.first_approver_name,
        staff_name: value.first_approver_name,
      };
      const info = {
        title: value.title,
        remark: value.remark,
        executed_at: value.executed_at || moment(new Date()).format('YYYY-MM-DD'),
      };
      return {
        ...state,
        addressees,
        final,
        first,
        info,
      };
    },
    saveData(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,
      };
    },
    saveStaff(state, action) {
      const { key, type, value } = action.payload;
      let staff = null;
      if (type.toString() === '1') {
        const obj = {
          staff_sn: value.staff_sn,
          realname: value.realname,
          staff_name: value.staff_name,
        };
        staff = { ...obj };
      } else {
        const staffSn = value.map((item) => { return item.staff_sn; });
        let temp = value.map((_) => {
          const obj = { staff_sn: _.staff_sn, realname: _.realname, staff_name: _.staff_name };
          return obj;
        });
        let newStaff = [...state[key]];
        newStaff.forEach((item) => {
          const valueIndex = staffSn.indexOf(item.staff_sn);
          if (valueIndex !== -1) {
            temp = temp.filter((its, idx) => idx !== valueIndex);
          }
        });
        newStaff = newStaff.concat(temp);
        staff = [...newStaff];
      }
      return {
        ...state,
        [key]: staff,
      };
    },

    clearModal(state) {
      const newState = {
        info: {
          executedAt: new Date(),
          description: '',
          participants: [],
        },
        optAll: {
          pointA: '',
          pointB: '',
          count: '',
        },
      };
      return {
        ...state,
        ...newState,
      };
    },
  },
};
