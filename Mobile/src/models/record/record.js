export default {
  namespace: 'record',
  state: {
    eventIndex: -1,
    eventStaff: [],
    optAll: [],
    eventAll: [],
    events: [],
  },
  effects: {
  },
  reducers: {
    // ...defaultReducers,
    saveEvent(state, action) {
      const event = action.payload.value;
      const opt = {
        pointA: event.point_a_default,
        pointB: event.point_b_default,
        count: 1,
      };
      const tmpEvent = {
        event_id: event.id,
        name: event.name,
        description: '',
        participants: [],
      };
      const eventIndex = sessionStorage.getItem('eventIndex');
      const newEvents = state.events;
      const newEventAll = state.eventAll;
      const newOptAll = state.optAll;
      newEvents[eventIndex] = { ...newEvents[eventIndex], ...tmpEvent };
      newOptAll[eventIndex] = { ...opt };
      newEventAll[eventIndex] = { ...event };
      return {
        ...state,
        events: newEvents,
        optAll: newOptAll,
        eventAll: newEventAll,
      };
    },

    saveEvents(state, action) {
      const { value, index } = action.payload;
      const { events } = state;
      const newEvents = [...events];
      newEvents[index] = { ...value };
      return {
        ...state,
        events: newEvents,
      };
    },

    saveEventKey(state, action) {
      const index = action.payload;
      return {
        ...state,
        eventIndex: index,
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
