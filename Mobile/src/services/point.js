import request from '../utils/request';

export async function getPointDetail(pointlog) {
  return request(`/api/points/statistic/${pointlog}`);
}


export async function getPointLog(params) {
  const url = params ? `?${params}` : '';
  return request(`/api/points/statistic/log${url}`, null, false);
}
