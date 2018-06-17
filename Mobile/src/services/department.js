import request from '../utils/request';

export async function department(id) {
  return request(`/api/departments/${id}/children-and-staff`);
}

export async function getStaff(id) {
  return request(`/api/departments/${id}/staff`);
}
export async function firstDepartment() {
  return request('/api/departments?filters=parent_id=0');
}

export async function serachStaff(search) {
  return request(`/api/staff?${search}`);
}
