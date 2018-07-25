
import request from '../utils/request';

export async function fetchBuckle(params, id) {
  return request(`/api/PMS/event-logs/${id}`, {
    method: 'GET',
    body: params,
  });
}

export async function fetchBuckleGroups(params, id) {
  return request(`/api/PMS/event-logs/groups/${id}`, {
    method: 'GET',
    body: params,
  });
}


export async function withdrawBuckle(id) {
  return request(`/api/PMS/event-logs/${id}/withdraw`, {
    method: 'PUT',
  });
}

export async function addBuckle(params) {
  return request('/api/PMS/event-logs/event', {
    method: 'POST',
    body: params,
  });
}
