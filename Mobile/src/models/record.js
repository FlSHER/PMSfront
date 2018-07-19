import { Toast } from 'antd-mobile';
import {
  recordBuckle,
  getAuditList,
  buckleReject,
  getBuckleDetail,
  withdrawBuckle,
  firstApprove,
  finalApprove,
  getLogsList,
} from '../services/buckle';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util.js';


export default {
  namespace: 'record',
  state: {
    eventIndex: -1,
    eventItems: {
    },
    events: [],
  },
  effects: {
  },
  reducers: {
    // ...defaultReducers,
    saveEvent(state, action) {
      const { value, index } = action.payload;
      const { event } = state;
      let newEvent = [...event];
      if (index) {
        newEvent = event.filter(_, i => i !== index);
      } else {
        newEvent.push(value);
      }
      return {
        ...state,
        event: newEvent,
      };
    },
    saveEventKey(state, action) {
      const index = action.payload;
      return {
        ...state,
        eventKey: index,
      };
    },
    saveEventStaff(state, action) {
      const { value } = action.payload;
      const { eventStaff, eventIndex } = state;
      const staffSn = value.map(item => item.staff_sn);
      if (eventIndex.toString().length) {
        Object.keys(eventStaff).forEach((key, i) => {
          if (i.toString() === eventIndex.toString()) {
            const staff = eventStaff[key];
            const temp = [...staff];
            staff.forEach((item) => {
              const valueIndex = staffSn.indexOf(item.staff_sn);
              if (valueIndex === -1) {
                temp.push([value[valueIndex]]);
              }
            });
            eventStaff[key] = temp;
          }
        });
      }
      return {
        ...state,
        eventStaff,
      };
    },


    saveData(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,
      };
    },
    saveList(state, action) {
      const info = { ...action.payload.value };
      const newList = { ...state[action.payload.key] };
      if (info.page !== 1) { // 多页
        let newData = [...newList[action.payload.type].data];
        newData = newData.concat(info.data);
        newList[action.payload.type] = { ...info, data: newData };
      } else {
        newList[action.payload.type] = { ...info };
      }
      return {
        ...state,
        [action.payload.key]: newList,
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
