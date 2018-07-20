export default {
  namespace: 'submit',
  state: {
    addressees: [],
    final: null,
    first: null,
    info: {
      title: '',
      remark: '',
      executed_at: new Date(),
    },
  },
  effects: {
  },
  reducers: {
    // ...defaultReducers,

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
        staff = { ...value };
      } else {
        const staffSn = value.map((item) => { return item.staff_sn; });
        let temp = value.map((_) => {
          const obj = { staff_sn: _.staff_sn, realname: _.realname, staff_name: _.staff_name };
          return obj;
        });
        const newStaff = [...state[key]];
        newStaff.forEach((item) => {
          const valueIndex = staffSn.indexOf(item.staff_sn);
          if (valueIndex !== -1) {
            temp = temp.filter((its, idx) => idx !== valueIndex);
          }
        });
        newStaff.concat(temp);
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
