import request from '../utils/request';

export async function userTarget(params) {
  return request('/api/staff/target', {
    method: 'GET',
    body: params,
    json: true,
  });
}

