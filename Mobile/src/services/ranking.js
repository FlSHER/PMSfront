import request from '../utils/request';

export async function getAuthorityGroup() {
  return request('/api/authority-group/rank', null, false);
}

export async function getRanking(params) {
  return request('/api/points/ranking/staff', {
    method: 'GET',
    body: params,
    json: true,
  });
}
export async function getStatiRanking(params) {
  return request('/api/points/statistic/ranking', {
    method: 'GET',
    body: params,
    json: true,
  });
}

