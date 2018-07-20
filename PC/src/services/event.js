
import request from '../utils/request';


export async function getEventName(id) {
  return request(`/api/PMS/event/${id}/events`);
}

export async function fetchEventType() {
  return request('/api/PMS/event/categories');
}

export async function fetchEvent(params) {
  return request('/api/PMS/event', {
    body: params,
    method: 'GET',
  });
}
