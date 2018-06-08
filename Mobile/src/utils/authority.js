// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authority = localStorage.getItem('antd-pro-authority') || [];
  if (localStorage.getItem('OA_access_token')
    && localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
    authority.push('token');
  }
  if (localStorage.getItem('OA_refresh_token')) {
    authority.push('refresh-token');
  }
  return authority;
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}
