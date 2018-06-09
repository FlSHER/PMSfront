import request from '../utils/request';

export async function department() {
  return request('/get/department');
}

export async function staff() {
  return request('/get/staff');
}
