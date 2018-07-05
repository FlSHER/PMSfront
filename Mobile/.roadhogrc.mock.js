// 是否禁用代理

const noProxy = process.env.NO_PROXY === 'true';
export default !noProxy ? {
  // 线上

  // OA
  'POST /oauth/(.*)': 'http://of.xigemall.com/oauth/',
  'GET /api/oa/(.*)': 'http://of.xigemall.com/api/',

  // 积分制
  'GET /api/(.*)': 'http://120.79.121.158:8004/api/',
  'POST /api/(.*)': 'http://120.79.121.158:8004/api/',
  'PUT /api/(.*)': 'http://120.79.121.158:8004/api/',
  'DELETE /api/(.*)': 'http://120.79.121.158:8004/api/',
} : {
    // 张博涵
    'GET /api/oa/current-user(.*)': 'http://192.168.20.238:8003/api/current-user',
    'GET /api/oa/departments(.*)': 'http://192.168.20.238:8003/api/departments',
    'GET /api/oa/staff(.*)': 'http://192.168.20.238:8003/api/staff',

    // 张博涵
    'POST /oauth/(.*)': 'http://localhost.oaupdate.org/oauth/',
    'POST /oauth/(.*)': 'http://192.168.20.238:8003/oauth/',
    'GET /api/oa/(.*)': 'http://192.168.20.238:8007/api/',
    'GET /api/(.*)': 'http://192.168.20.238:8007/api/',
    'POST /api/(.*)': 'http://192.168.20.238:8007/api/',
    'PUT /api/(.*)': 'http://192.168.20.238:8007/api/',
    'DELETE /api/(.*)': 'http://192.168.20.238:8007/api/',


    // 张卫
    // 'GET /api/(.*)': 'http://PMS.test/api/',
    // 'POST /api/(.*)': 'http://PMS.test/api/',
    // 'PUT /api/(.*)': 'http://PMS.test/api/',
    // 'DELETE /api/(.*)': 'http://PMS.test/api/',
  };

