import request from '../utils/request';

export async function loginByTelephone(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}
export async function queryCurrent() {
  const response = request('/api/current-user').catch(() => {
    return undefined;
  });
  return response;
}
