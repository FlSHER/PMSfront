import React from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
import App from './routes/App.js';


let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

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
    dynamicWrapper,
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
