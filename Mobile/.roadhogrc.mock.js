// 是否禁用代理
// const noProxy = process.env.NO_PROXY === 'false';
export default {
  'POST /api/approval/(.*)': 'http://192.168.20.144:8002/api/approval',
    'GET /api/(.*)': 'http://192.168.20.16:8009/api/',
    'POST /api/(.*)': 'http://192.168.20.16:8009/api/',
    'PUT /api/(.*)': 'http://192.168.20.16:8009/api/',
    'DELETE /api/(.*)': 'http://192.168.20.16:8009/api/',
    // 'POST /oauth/(.*)': 'http://localhost.oaupdate.org/oauth/',
    'POST /oauth/(.*)': 'http://192.168.20.238:8003/oauth/'
};
