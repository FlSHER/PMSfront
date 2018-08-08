

export default {
  namespace: 'tabs',
  state: {
    reward: '1',
  },
  reducers: {
    save(state, { payload }) {
      const { store, value, callBack } = payload;
      if (callBack) callBack();
      return {
        ...state,
        [store]: `${value}`,
      };
    },
  },
};
