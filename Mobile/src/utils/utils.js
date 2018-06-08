import { Toast } from 'antd-mobile'
import config from '../configs/config'


export function env() {
  const host = window.location.hostname
  if (host.indexOf(config.productionDomain) >= 0) {
    return 'production'
  } else if (host.indexOf(config.testingDomain) >= 0) {
    return 'testing'
  }
  return 'development'
}

export function log(...m) {
  // 只在开发环境写log
  if (env() === 'development') {
    console.log(...m)
  }
}

export function apiPrefix() {
  const myEnv = env()
  if (myEnv === 'production') {
    return config.apiPrefix.production
  } else if (myEnv === 'testing') {
    return config.apiPrefix.testing
  }
  return config.apiPrefix.development
}

export function domain() {
  const myEnv = env()
  if (myEnv === 'production') {
    return config.domain.production
  } else if (myEnv === 'testing') {
    return config.domain.testing
  }
  return config.domain.development
}

function dealErrorData(data) {
  const code = data.code
  switch (code) {
    case undefined:
      Toast.fail('网络错误，请稍后再试')
      break
    case 404: {
      // const notfundUrl = `${domain()}#404`
      // window.location.href = notfundUrl
      break
    }
    case 405: {
      // const loginUrl = `${domain()}#login`
      // window.location.href = loginUrl
      break
    }
    case 506:
    case 507:
    Toast.fail('服务器正忙，请稍后再试')
      break
    default:
    Toast.fail(data.msg)
      break
  }
}

/**
 * 过滤接口数据
 * @param {*} data
 * @param {*} okMsg 是否显示一个操作成功的提示
 */
export function filterData(data, okMsg) {
  if (data.code && data.code == 200) {
    if (okMsg === true) {
      Toast.success('操作成功')
    }
    return data.results
  }
  dealErrorData(data)
  return false
}

/**
 * 返回结果：false 错误的路由
 * 返回对象：{ model: routes[0], originAction: routes[1], action, id: routes[2], cus: routes[3] }
 * @param {string} pathname 路径
 */
export function analyzePath(pathname) {
  let path = pathname
  if (pathname.indexOf('/') === 0) {
    path = pathname.substr(1)
  }
  const routes = path.split('/')
  if (routes.length >= 2) {
    let mayAction = 'null'
    if (routes[1] === 'list') {
      mayAction = 'list'
    } else if (routes[1] === 'detail' || routes[1] === 'edit') {
      mayAction = 'detail'
    }
    return {
      model: routes[0],
      originAction: routes[1],
      action: mayAction,
      id: routes[2],
    }
  }
  return false
}

export function upperModel(modelStr) {
  const strs = modelStr.split('_')
  let upper = ''
  for (const i in strs) {
    const str = strs[i]
    upper = upper + str.substr(0, 1).toUpperCase() + str.substr(1)
  }
  return upper
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
export function* iput(put, data, reduce, modelspace) {
  if (data.code && data.code == 200) {
    let toPayload = {}
    let toReduce = 'success'
    if (typeof reduce === 'undefined') {
      toPayload = data.results
    } else if (typeof reduce === 'string') {
      toPayload[reduce] = data.results
    } else {
      toReduce = reduce.reduce
      if (reduce.cusResult) {
        toPayload = reduce.cusResult
      } else {
        toPayload = data.results
      }
    }
    if (typeof modelspace === 'string') {
      toPayload.modelspace = modelspace
    }
    yield put({
      type: toReduce,
      payload: toPayload,
    })
  } else {
    dealErrorData(data)
  }
}
