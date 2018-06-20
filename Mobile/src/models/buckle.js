import defaultReducers from './reducers/default';

export default {
  namespace: 'buckle',
  state: {
    selectStaff: [],
  },
  effects: {


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
