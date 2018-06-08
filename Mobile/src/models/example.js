
export default {

  namespace: 'example',

  state: {
    bread: [
      {
        'id': 'all',
        name: '全部'
      },
    ],
    department: [
      {
        name: 'weiy',
        id: 1
      },
      {
        name: 'weiy',
        id: 2
      },
    ],
    staff:[

    ]
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
