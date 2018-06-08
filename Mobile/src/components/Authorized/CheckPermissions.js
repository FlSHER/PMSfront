import React from 'react';
import PromiseRender from './PromiseRender';
import { CURRENT } from './index';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    for (const i in authority) {
      if (currentAuthority.indexOf(authority[i]) === -1) {
        return Exception;
      }
    }
    return target;
    // if (authority.indexOf(currentAuthority) >= 0) {
    //   return target;
    // }
    // return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (currentAuthority.indexOf(authority) >= 0) {
      return target;
    }
    // if (authority === currentAuthority) {
    //   return target;
    // }
    return Exception;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return () => (
      <PromiseRender ok={target} error={Exception} promise={authority} />
    );
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority();
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
