import eventEffects from './event';
import typeEffects from './eventType';
import finalStaffEffects from './finalStaff';
import defaultReducers from '../reducers/default';

export default {
  namespace: 'event',
  state: {
    event: [],
    type: [],
    details: {},
    finalStaff: [],
  },
  effects: {
    ...eventEffects,
    ...typeEffects,
    ...finalStaffEffects,
  },
  reducers: {
    ...defaultReducers,
  },
};
