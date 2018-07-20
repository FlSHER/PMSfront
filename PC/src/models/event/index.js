import eventEffects from './event';
import typeEffects from './eventType';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'event',
  state: {
    event: [],
    type: [],
    details: {},
  },
  effects: {
    ...eventEffects,
    ...typeEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
