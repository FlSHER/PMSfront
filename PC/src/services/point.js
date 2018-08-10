import request from '../utils/request';

export async function fetchDetail(params) {
  return request('/api/PMS/points/statistic/log', {
    method: 'GET',
    body: params,
  });
}

export async function fetchSource() {
  return request('/api/PMS/points/source', {
    method: 'GET',
  });
}

export async function fetchDetailInfo(id) {
  return request(`/api/PMS/points/statistic/${id}`, {
    method: 'GET',
  });
}
