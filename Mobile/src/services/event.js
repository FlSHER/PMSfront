
import request from '../utils/request';

export async function getEvent() {
  return request('/api/event-logs/categories');
}

export async function getEventName(id) {
  return request(`/api/event-logs/${id}/events`);
}
