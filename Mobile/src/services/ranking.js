import request from '../utils/request';

export async function getAuthorityGroup() {
  return request('/api/authority-groups');
}

export async function getRanking(params) {
  return request('/api/points/ranking/staff', {
    method: 'GET',
    body: params,
    json: true,
  });
}

