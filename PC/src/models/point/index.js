import detailEffects from './detail';
import sourceEffects from './source';
import typeEffects from './type';
import meEffects from './me';
import rankEffects from './rank';
import accumulativeEffects from './all';
import staffAuthGroupEffects from './staffAuthGroup';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'point',
  state: {
    pointDetails: {},
    accumulative: {},
    source: [],
    type: [],
    staffAuthority: {},
    me: {},
    rankDetails: {},
  },
  effects: {
    ...staffAuthGroupEffects,
    ...accumulativeEffects,
    ...typeEffects,
    ...meEffects,
    ...detailEffects,
    ...sourceEffects,
    ...rankEffects,
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
