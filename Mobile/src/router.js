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
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <AuthorizedRoute
          path="/"
          render={props => <BasicLayout {...props} />}
          // authority={['token']}
          // redirectPath="/refresh_access_token"
          redirectPath="/home"
        />
      </Switch>
    </ConnectedRouter>
  );
}
export default RouterConfig;
