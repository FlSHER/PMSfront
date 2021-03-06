import axios from 'axios';
import { Toast } from 'antd-mobile';
import { dealErrorData } from './util';

const fetch = (url, options) => {
  const {
    method,
    body,
    headers,
  } = options;
  const axo = axios.create({
    timeout: 20000,
    headers,
  });
  const newMethod = method.toLowerCase();
  switch (true) {
    case newMethod === 'get':
      return axo.get(url);
    case newMethod === 'post':
      return axo.post(url, body);
    case newMethod === 'put' && body === undefined:
      return axo.put(url);
    case newMethod === 'put':
      return axo.put(url, body);
    case newMethod === 'delete':
      return axo.delete(url);
    default:
      return axo.get(url);
  }
};

function checkStatus(response) {
  Toast.hide();
  // const {
  //   status
  // } = response;
  // if ((status >= 200 && status < 300) || status === 402) {
  //   return response;
  // }
  return response;
  // status === 422 表单验证
  // const errortext = codeMessage[status] || response.statusText;
  // Toast.fail(`请求错误 ${status}: ${response.url}`)
  // const error = new Error(errortext);
  // error.name = status;
  // error.response = response;
  // throw error;
}
export default function request(uri, params, loading = true) {
  if (loading) {
    Toast.loading('加载中...');
  }
  let urlParam = uri;
  const defaultOptions = {
    credentials: 'include',
  };
  if (uri.match(/\/api\//)) {
    if (localStorage.getItem('OA_access_token') &&
      localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
      defaultOptions.headers = {
        Authorization: `Bearer ${localStorage.getItem('OA_access_token')}`,
      };
    } else {
      window.location.href = `${OA_PATH}/oauth/authorize?client_id=${OA_CLIENT_ID}&response_type=code`;
    }
  }
  const newOptions = {
    ...defaultOptions,
    ...params,
    method: params ? params.method : 'GET',
  };

  newOptions.headers = {
    Accept: 'application/json',
    ...newOptions.headers,
  };
  if (newOptions.body) {
    newOptions.headers = {
      'Content-Type': 'application/json;charset=utf-8',
      ...newOptions.headers,
    };
  }
  if (newOptions.method === 'GET' && newOptions.body) {
    const paramsArray = [];
    newOptions.headers = {
      Accept: 'application/json',
      // 'Content-Type': 'application/json;charset=utf-8',
      ...newOptions.headers,
    };
    Object.keys(newOptions.body).forEach((key) => {
      let param = newOptions.body[key];
      if (typeof param === 'object') {
        param = JSON.stringify(param);
      }
      paramsArray.push(`${key}=${param}`);
    });
    if (uri.search(/\?/) === -1 && paramsArray.length > 0) {
      urlParam += `?${paramsArray.join('&')}`;
    } else if (paramsArray.length > 0) {
      urlParam += `&${paramsArray.join('&')}`;
    }
  }
  return fetch(urlParam, newOptions)
    .then(checkStatus)
    .then((response) => {
      const { data } = response;
      Toast.hide();
      if (newOptions.method === 'DELETE' && response.status === 204) {
        const obj = { status: '204', message: '删除成功' };
        return { ...obj, data };
      }
      if (newOptions.method === 'PUT' && response.status === 201) {
        const obj = { status: '201', message: '操作成功', data };
        return { ...obj };
      }
      return data;
    }).catch((error) => {
      Toast.hide();
      const {
        response,
      } = error;
      if (response) {
        const {
          data,
          status,
        } = response;
        // return Promise.reject({ error: true, message: dealErrorData(data, status) });
        return {
          error: true, message: dealErrorData(data, status),
        };
      } else {
        // return Promise.reject({ error: true, message: '网络错误' });
        return {
          error: true, message: '网络错误',
        };
      }
    })
    .catch((error) => { // 加上catch
      Toast.hide();
      return error;
    });
}
