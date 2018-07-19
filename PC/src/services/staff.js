import request from '../utils/request';

export async function fetchStaff(params) {
  return request('/api/staff', {
    method: 'GET',
    body: { ...params },
  });
}

export async function fetchStaffInfo(staffSn) {
  return request(`/api/staff/${staffSn}`, {
    method: 'GET',
  });
}
