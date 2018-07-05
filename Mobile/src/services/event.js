
import request from '../utils/request';

export async function getEvent() {
  return request('/api/event/categories');
}

export async function getEventName(id) {
  return request(`/api/event/${id}/events`);
}
