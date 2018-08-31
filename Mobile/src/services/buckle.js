
import request from '../utils/request';

export async function recordBuckle(params) {
  return request('/api/event-logs/event', {
    method: 'POST',
    body: params,
    json: true,
  });
}

export async function getLogsList(params) {
  return request('/api/event-logs', {
    method: 'GET',
    body: params,
    json: true,
  }, false);
}


export async function getLogsGroupList(params) {
  return request('/api/event-logs/groups', {
    method: 'GET',
    body: params,
    json: true,
  }, false);
}

export async function getAuditList(params) {
  const url = params ? `?${params}` : '';
  return request(`/api/event-logs/groups${url}`, null, false);
}


export async function getBuckleDetail(id) {
  return request(`/api/event-logs/${id}`);
}

export async function getBaseDetail(id) {
  return request(`/api/points/base-point/logs/${id}`);
}

export async function getLogGroupDetail(id) {
  return request(`/api/event-logs/groups/${id}`);
}


export async function withdrawBuckle(data) {
  return request(`/api/event-logs/${data.id}/withdraw`, {
    method: 'PUT',
    body: data.params,
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

export async function buckleReject(data) {
  return request(`/api/event-logs/${data.event_id}/reject`, {
    body: data.param,
    json: true,
    method: 'PUT',
  });
}

