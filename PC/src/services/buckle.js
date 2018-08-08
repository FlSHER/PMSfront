
import request from '../utils/request';

/**
 * 单条列表
 */
export async function fetchBuckle(params, id) {
  return request(`/api/PMS/event-logs/${id}`, {
    method: 'GET',
    body: params,
  });
}

/**
 * 多条列表
 */
export async function fetchBuckleGroups(params, id) {
  return request(`/api/PMS/event-logs/groups/${id}`, {
    method: 'GET',
    body: params,
  });
}


export async function withdrawBuckle(params, id) {
  return request(`/api/PMS/event-logs/${id}/withdraw`, {
    method: 'PUT',
    body: params,
  });
}

export async function addBuckle(params) {
  return request('/api/PMS/event-logs/event', {
    method: 'POST',
    body: params,
  });
}

/**
 * 奖扣审核
 */
export async function firstCheck(params, id) {
  return request(`/api/PMS/event-logs/${id}/first-approve`, {
    method: 'PUT',
    body: params,
  });
}

export async function finalCheck(params, id) {
  return request(`/api/PMS/event-logs/${id}/final-approve`, {
    method: 'PUT',
    body: params,
  });
}

/**
 *  驳回
 */
export async function reject(params, id) {
  return request(`/api/PMS/event-logs/${id}/reject`, {
    method: 'PUT',
    body: params,
  });
}

