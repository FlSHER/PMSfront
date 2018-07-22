export default {
  namespace: 'record',
  state: {
    eventIndex: -1,
    participants: {},
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

    deleteEvents(state, action) {
      const { index } = action.payload;
      const { events, participants } = state;
      const newEvents = events.filter((item, i) => i !== index);
      delete participants[index];
      return {
        ...state,
        events: newEvents,
        participants,
      };
    },

    saveEventKey(state, action) {
      const index = action.payload;
      return {
        ...state,
        eventIndex: index,
      };
    },

    saveStaff(state, action) {
      const { value, key } = action.payload;
      const { eventIndex, events } = state;
      const newEvents = [...events];
      const eventStaff = state[key];
      const staffSn = value.map(item => item.staff_sn);
      if (eventIndex.toString().length) {
        Object.keys(eventStaff).forEach((k, i) => {
          if (i.toString() === eventIndex.toString()) {
            const staff = eventStaff[k];
            let temp = value.map((_) => {
              const obj = { staff_sn: _.staff_sn, staff_name: _.staff_name || _.realname };
              return obj;
            });
            if (staff.length) {
              staff.forEach((item) => {
                const valueIndex = staffSn.indexOf(item.staff_sn);
                if (valueIndex !== -1) {
                  temp = temp.filter((its, idx) => idx !== valueIndex);
                }
              });
              eventStaff[k] = [...eventStaff[k], ...temp];
            } else {
              eventStaff[k] = [...temp];
            }
          }
        });
      }
      console.log(eventStaff);
      newEvents[eventIndex].participants = eventStaff[eventIndex];
      return {
        ...state,
        [key]: eventStaff,
        events: newEvents,
      };
    },

    saveEventStaff(state, action) {
      const { index, value } = action.payload;
      const newStaff = state.participants;
      newStaff[index] = [...value];
      return {
        ...state,
        participants: newStaff,
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
