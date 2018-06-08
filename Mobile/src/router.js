import React from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/App.js';

const {
  ConnectedRouter,
} = routerRedux;

function RouterConfig({
  app,
  history,
}) {
  const error = dynamic({
    app,
    component: () => import('./routes/error'),
  });
  const oauthRoutes = [
    {
      path: '/get_access_token',
      models: () => [import('./models/oauth')],
      component: () => import('./routes/oauth/GetAccessToken'),
    },
    {
      path: '/refresh_access_token',
      models: () => [import('./models/oauth'),
      ],
      component: () => import('./routes/oauth/RefreshAccessToken'),
    },
    {
      path: '/redirect_to_authorize',
      models: () => [import('./models/oauth'),
      ],
      component: () => import('./routes/oauth/RedirectToAuthorize'),
    },
  ];
  const routes = [
    {
      path: '/home',
      models: () => [],
      component: () => import('./routes/IndexPage'),
    },
    {
      path: '/buckle_record',
      models: () => [],
      component: () => import('./routes/buckle/record/record.js'),
    },
    {
      path: '/test_selperson',
      models: () => [],
      component: () => import('./routes/test/SelPerson'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <Switch>
        {oauthRoutes.map(({ path, ...dynamics }, key) => {
const idx = key;
return (
  <Route
    key={idx}
    exact
    path={path}
    component={dynamic({
app,
...dynamics,
})}
  />
);
})}

        <App>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (<Redirect to="/home" />)}
            />
            {
routes.map(({ path, ...dynamics }, key) => {
const ix = key;
return (
  <Route
    key={ix}
    exact
    path={path}
    component={dynamic({
app,
...dynamics,
})}
  />
);
})
}
            <Route component={error} />
          </Switch>
        </App>
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
