

export default {
  namespace: 'table',
  state: {
    bodyHeight: null,
    contentHeigth: null,
  },
  reducers: {
    save(_, { payload }) {
      return {
        ...payload,
      };
    },
  },
};
