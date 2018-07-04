module.exports = {
  develepDomain: 'localhost', // 生产环境域名
  testingDomain: 'localhost', // 测试环境域名
  productitionDomain: 'http://120.79.121.158',
  openPages: ['/home', '/audit_list', '/my'], // 单页路径（显示footer的页面）
  apiPrefix: { // 不同环境api地址前缀
    production: 'http://192.168.20.238:8006',
    testing: 'http://192.168.20.238:8006',
    development: 'http://192.168.20.238:8006',
    // development: 'http://127.0.0.1/edu/api/',
  },
  domain: { // 不同环境本项目访问地址
    production: 'http://47.100.46.51/edu_admin/',
    testing: 'http://lianwuyun.cn/edu_admin/',
    development: 'http://localhost:8000/',
  },
  OA_PATH: { // 不同环境本项目访问地址
    production: 'http://of.xigemall.com',
    testing: 'http://192.168.20.238:8003',
    development: 'http://192.168.20.238:8003',
  },
  OA_CLIENT_ID: {
    production: '8',
    testing: '7',
    development: '7',
  },
  OA_CLIENT_SECRET: {
    production: 'lmL6z770WU4MkCMKYGPpSh37XcJ1Q83zcsBeQMxr',
    testing: 'lcBIS0l1eW038wqUgDf6qsNyUl3L69Ck8YxHXKGh',
    development: 'lcBIS0l1eW038wqUgDf6qsNyUl3L69Ck8YxHXKGh',
  },
  qiniuPrefix: 'http://ov2ek9bbx.bkt.clouddn.com/', // 七牛前缀
  leaveClean: true, // 离开模块是否清理数据
};

