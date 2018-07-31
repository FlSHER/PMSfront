import request from '../utils/request';

export async function getPointDetail(pointlog) {
  return request(`/api/points/statistic/${pointlog}`);
}

export async function getPointLog(params) {
  return request('/api/points/statistic/log', {
    method: 'GET',
    body: params,
    json: true,
  }, false);
}

export async function getPointLog2(params) {
  const url = params ? `?${params}` : '';
  return request(`/api/points/statistic/log${url}`, null, false);
}
