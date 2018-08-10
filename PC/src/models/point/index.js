import detailEffects from './detail';
import sourceEffects from './source';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'point',
  state: {
    pointDetails: {},
    source: [],
  },
  effects: {
    ...detailEffects,
    ...sourceEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
