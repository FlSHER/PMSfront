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
    'GET /api/oa/current-user(.*)': 'http://112.74.177.132:8002/api/current-user',
    'GET /api/oa/departments(.*)': 'http://112.74.177.132:8002/api/departments',
    'GET /api/oa/staff(.*)': 'http://112.74.177.132:8002/api/staff',

    // 张博涵
    'POST /oauth/(.*)': 'http://112.74.177.132:8002/oauth/',
    'POST /oauth/(.*)': 'http://112.74.177.132:8002/oauth/',
    'GET /api/oa/(.*)': 'http://112.74.177.132:8002/api/',
    // 'GET /api/(.*)': 'http://112.74.177.132:8009/api/',
    // 'POST /api/(.*)': 'http://112.74.177.132:8009/api/',
    // 'PUT /api/(.*)': 'http://1112.74.177.132:8009/api/',
    // 'DELETE /api/(.*)': 'http://112.74.177.132:8009/api/',

    // 张卫
    'GET /api/(.*)': 'http://112.74.177.132:8009/api/',
    'POST /api/(.*)': 'http://112.74.177.132:8009/api/',
    'PUT /api/(.*)': 'http://112.74.177.132:8009/api/',
    'DELETE /api/(.*)': 'http://112.74.177.132:8009/api/',
  };

