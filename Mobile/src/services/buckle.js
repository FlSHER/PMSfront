
import request from '../utils/request';

export async function recordBuckle(params) {
  return request('/api/event-logs/event', {
    method: 'POST',
    body: params,
    json: true,
  });
}
export async function getAuditList(params) {
  return request('/api/event-logs/audit', {
    method: 'GET',
    body: params,
    json: true,
  });
}

export async function getLogsList(params) {
  return request('/api/event-logs', {
    method: 'POST',
    body: params,
    json: true,
  });
}


export async function getBuckleDetail(id) {
  return request(`/api/event-logs/${id}`);
}

export async function withdrawBuckle(id) {
  return request(`/api/event-logs/${id}/withdraw`, {
    method: 'PUT',
  });
}

export async function firstApprove(data) {
  return request(`/api/event-logs/${data.event_id}/first-approve`, {
    body: data.param,
    json: true,
    method: 'PUT',
  });
}

export async function finalApprove(data) {
  return request(`/api/event-logs/${data.event_id}/final-approve`, {
    body: data.param,
    json: true,
    method: 'PUT',
  });
}
