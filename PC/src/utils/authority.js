// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  let authority = [];
  const auth = localStorage.getItem('antd-pc-authority');
  if (JSON.parse(auth)) {
    authority = JSON.parse(auth);
  }
  if (localStorage.getItem('PMS_access_token')
    && localStorage.getItem('PMS_access_token_expires_in') > new Date().getTime()) {
    authority.push('token');
  }
  if (localStorage.getItem('PMS_refresh_token')) {
    authority.push('refresh-token');
  }
  console.log(authority);
  return authority;
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pc-authority', authority);
}
