import request from '../utils/request';

export async function pointStatistic(params) {
  return request('/api/points/statistic/mine', {
    method: 'GET',
    body: params,
    json: true,
  });
}

