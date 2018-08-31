import detailEffects from './detail';
import sourceEffects from './source';
import typeEffects from './type';
import meEffects from './me';
import rankEffects from './rank';
import accumulativeEffects from './all';
import staffAuthGroupEffects from './staffAuthGroup';
import basePointEffects from './basePoint';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'point',
  state: {
    pointDetails: {},
    accumulative: {},
    accumulativeStaff: {},
    source: [],
    type: [],
    staffAuthority: {},
    me: {},
    rankDetails: {},
    basePointDetails: {},
  },
  effects: {
    ...staffAuthGroupEffects,
    ...accumulativeEffects,
    ...typeEffects,
    ...meEffects,
    ...detailEffects,
    ...sourceEffects,
    ...rankEffects,
    ...basePointEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
