import React from 'react';
import { routerRedux, Switch } from 'dva/router';
// import { LocaleProvider, Spin } from 'antd';
// import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
// import { getRoutes } from './utils/util';
// import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
// dynamic.setDefaultLoadingComponent(() => {
//   return <Spin size="large" className={styles.globalSpin} />;
// });

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  // const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const GetAccessToken = routerData['/passport/get_access_token'].component;
  const RefreshAccessToken = routerData['/passport/refresh_access_token'].component;
  const RedirectToAuthorize = routerData['/passport/redirect_to_authorize'].component;


  return (
    <ConnectedRouter history={history}>
      <Switch>
        <AuthorizedRoute
          path="/passport/get_access_token"
          render={props => <GetAccessToken {...props} />}
          redirectPath="/passport/refresh_access_token"
        />
        <AuthorizedRoute
          path="/passport/refresh_access_token"
          render={props => <RefreshAccessToken {...props} />}
          redirectPath="/passport/refresh_access_token"
        />
        <AuthorizedRoute
          path="/passport/redirect_to_authorize"
          render={props => <RedirectToAuthorize {...props} />}
          redirectPath="/passport/refresh_access_token"
        />
        <AuthorizedRoute
          path="/"
          render={props => <BasicLayout {...props} />}
          // authority={['token']}
          redirectPath="/passport/refresh_access_token"
        // redirectPath="/home"
        />
      </Switch>
    </ConnectedRouter>
  );
}
export default RouterConfig;
