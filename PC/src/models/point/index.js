import detailEffects from './detail';
import sourceEffects from './source';
import typeEffects from './type';
import meEffects from './me';
import accumulativeEffects from './all';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'point',
  state: {
    pointDetails: {},
    accumulative: {},
    source: [],
    type: [],
    me: {},
  },
  effects: {
    ...accumulativeEffects,
    ...typeEffects,
    ...meEffects,
    ...detailEffects,
    ...sourceEffects,
  },
  reducers: {
    ...defaultReducers,
    saveMyPoint(state, action) {
      const { store, datetime, data } = action.payload;
      const dataSource = { ...state[store] };
      dataSource[datetime] = data;
      return {
        ...state,
        [store]: dataSource,
      };
    },
  },
};
