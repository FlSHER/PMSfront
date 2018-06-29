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
  const GetAccessToken = routerData['/get_access_token'].component;
  const RefreshAccessToken = routerData['/refresh_access_token'].component;
  const RedirectToAuthorize = routerData['/redirect_to_authorize'].component;


  return (
    <ConnectedRouter history={history}>
      <Switch>
        <AuthorizedRoute
          path="/get_access_token"
          render={props => <GetAccessToken {...props} />}
          redirectPath="/refresh_access_token"
        />
        <AuthorizedRoute
          path="/refresh_access_token"
          render={props => <RefreshAccessToken {...props} />}
          redirectPath="/refresh_access_token"
        />
        <AuthorizedRoute
          path="/redirect_to_authorize"
          render={props => <RedirectToAuthorize {...props} />}
          redirectPath="/refresh_access_token"
        />
        <AuthorizedRoute
          path="/"
          render={props => <BasicLayout {...props} />}
          // authority={['token']}
          redirectPath="/refresh_access_token"
        // redirectPath="/home"
        />
      </Switch>
    </ConnectedRouter>
  );
}
export default RouterConfig;
