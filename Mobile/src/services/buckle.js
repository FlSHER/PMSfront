
import request from '../utils/request';

export async function recordBuckle(params) {
  return request('/api/event-logs/event', {
    method: 'POST',
    body: params,
    json: true,
  });
}
export async function getAuditList(params) {
  return request('/api/event-logs', {
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
