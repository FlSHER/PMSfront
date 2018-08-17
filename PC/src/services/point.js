import request from '../utils/request';

/**
 * 积分明细
 * @param {} params
 */
export async function fetchDetail(params) {
  return request('/api/PMS/points/statistic/log', {
    method: 'GET',
    body: params,
  });
}

/**
 * 积分来源
 */
export async function fetchSource() {
  return request('/api/PMS/points/source', {
    method: 'GET',
  });
}

/**
 * 积分类型
 */
export async function fetchType() {
  return request('/api/PMS/points/type', {
    method: 'GET',
  });
}

/**
 *  明细详情
 */
export async function fetchDetailInfo(id) {
  return request(`/api/PMS/points/statistic/${id}`, {
    method: 'GET',
  });
}

/**
 * 我的积分
 */
export async function fetchMyPoint(params) {
  return request('/api/PMS/points/statistic/mine', {
    method: 'GET',
    body: params,
  });
}

/**
 * 累计积分
 */
export async function fetchAccumulative() {
  return request('/api/PMS/points/all', {
    method: 'GET',
  });
}


/**
 * 积分排行
 */

export async function fetchRank(params) {
  return request('/api/PMS/points/ranking/staff', {
    method: 'GET',
    body: params,
  });
}

/**
 * 获取员工权限分组
 */

export async function fetchStaffAuthority() {
  return request('/api/PMS/authority-group/rank', {
    method: 'GET',
  });
}
