import {
  Toast,
} from 'antd-mobile';
import config from '../configs/config.js';

export function env() {
  const host = window.location.hostname;
  if (host.indexOf(config.develepDomain) >= 0) {
    return 'development';
  } else if (host.indexOf(config.testingDomain) >= 0) {
    return 'testing';
  }
  return 'production';
}

export function apiPrefix() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.apiPrefix.production;
  } else if (myEnv === 'testing') {
    return config.apiPrefix.testing;
  }
  return config.apiPrefix.development;
}

export function OA_PATH() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_PATH.production;
  } else if (myEnv === 'testing') {
    return config.OA_PATH.testing;
  }
  return config.OA_PATH.development;
}

export function OA_CLIENT_ID() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_CLIENT_ID.production;
  } else if (myEnv === 'testing') {
    return config.OA_CLIENT_ID.testing;
  }
  return config.OA_CLIENT_ID.development;
}

export function OA_CLIENT_SECRET() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_CLIENT_SECRET.production;
  } else if (myEnv === 'testing') {
    return config.OA_CLIENT_SECRET.testing;
  }
  return config.OA_CLIENT_SECRET.development;
}

export function domain() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.domain.production;
  } else if (myEnv === 'testing') {
    return config.domain.testing;
  }
  return config.domain.development;
}


const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
export function dealErrorData(data, code) {
  const { errors } = data;
  let msg = '网络异常';
  if (code === 422) {
    const errs = [];
    if (errors) {
      for (const key in errors) {
        if (key === undefined) {
          errs.push(errors[key][0]);
        }
      }
      [msg] = errs;
    }
  } else {
    msg = codeMessage[code];
  }
  return msg;
}

/**
 * 过滤接口数据
 * @param {*} data
 * @param {*} okMsg 是否显示一个操作成功的提示
 */
export function filterData(data, okMsg) {
  if (data.code && data.code === 200) {
    if (okMsg === true) {
      Toast.success('操作成功', 1);
    }
    return data.results;
  }
  dealErrorData(data);
  return false;
}

/**
 * 通用数据处理
 * @param {*} put reduce的put
 * @param {object} data 需要处理的数据
 * @param {string|object} reduce 当为string时，会默认调用model中的success方法,并将传入的值作为返回数据的key使用，
 * 用data.results作为value，通常在success中使用return { ...state, ...payload }就可以覆盖state中`reduce`对应的值;
 * 当不想调用success而调用其他的处理方法时，传入对象{reduce:reduceYouWantTocall,cusResult:yourCusResult}
 * 其中必填参数reduce表示需要调用的方法，可选参数cusResult表示不适用默认的data.results作为数据而使用自己传入的
 * 例如{reduce:'getRoles',cusResult:{page:1}}表示请求成功后调用model中getRoles方法并使用参数{page:1}
 */


export function analyzePath(pathname, i) {
  let path = pathname;
  if (pathname.indexOf('/') === 0) {
    path = pathname.substr(1);
  }
  const routes = path.split('/');

  return routes[i];
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}
