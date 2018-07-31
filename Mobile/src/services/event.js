
import request from '../utils/request';

export async function getEvent() {
  return request('/api/event/categories', null, false);
}

export async function getEventName(id) {
  return request(`/api/event/${id}/events`, null, false);
}

export async function searchEventName(params) {
  return request('/api/event', {
    body: params,
    method: 'GET',
  }, false);
}
