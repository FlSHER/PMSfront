import { createElement } from 'react';
import dynamic from 'dva/dynamic';

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


export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper(app, [], () => import('../routes/Home/IndexPage')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../routes/Home/IndexPage')),
    },
    '/buckle_record': {
      component: dynamicWrapper(app, ['buckle'], () => import('../routes/Buckle/record/record')),
    },
    '/buckle_record/:id': {
      component: dynamicWrapper(app, ['buckle'], () => import('../routes/Buckle/record/record')),
    },
    '/buckle_list': {
      component: dynamicWrapper(app, [], () => import('../routes/Buckle/mine/buckleList')),
    },
    '/audit_list': {
      component: dynamicWrapper(app, ['buckle', 'oauth'], () => import('../routes/Buckle/audit/auditList')),
    },
    '/audit_reason/:type/:state/:level': {
      component: dynamicWrapper(app, [], () => import('../routes/Buckle/audit/auditReason')),
    },
    '/audit_detail/:id': {
      component: dynamicWrapper(app, ['buckle', 'oauth'], () => import('../routes/Buckle/audit/auditDetail')),
    },
    '/point_detail/:id': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/survey/pointDetail')),
    },
    '/point_survey': {
      component: dynamicWrapper(app, [], () => import('../routes/Point/survey/pointSurvey')),
    },
    '/point_list': {
      component: dynamicWrapper(app, ['point'], () => import('../routes/Point/survey/pointList')),
    },
    '/ranking': {
      component: dynamicWrapper(app, ['ranking'], () => import('../routes/Point/ranking/rankingList')),
    },
    '/opt_ranking': {
      component: dynamicWrapper(app, ['ranking'], () => import('../routes/Point/ranking/operRankList')),
    },
    '/ranking_group': {
      component: dynamicWrapper(app, ['ranking'], () => import('../routes/Point/ranking/rankingGroup')),
    },
    '/my': {
      component: dynamicWrapper(app, [], () => import('../routes/My/my')),
    },
    '/sel_person/:key/:type': {
      component: dynamicWrapper(app, ['searchStaff'], () => import('../routes/SelectPlugins/SelPerson')),
    },
    '/sel_event': {
      component: dynamicWrapper(app, ['event', 'searchStaff', 'buckle'], () => import('../routes/SelectPlugins/SelEvent')),
    },
    '/test': {
      component: dynamicWrapper(app, ['searchStaff'], () => import('../routes/test')),
    },
    '/test2': {
      component: dynamicWrapper(app, ['searchStaff'], () => import('../routes/Test/test')),
    },
    '/get_access_token': {
      component: dynamicWrapper(app, ['oauth'], () => import('../routes/Oauth/GetAccessToken')),
    },
    '/refresh_access_token': {
      component: dynamicWrapper(app, ['oauth'], () => import('../routes/Oauth/RefreshAccessToken')),
      authority: 'refresh-token',
      redirectPath: '/redirect_to_authorize',
    },
    '/redirect_to_authorize': {
      component: dynamicWrapper(app, ['oauth'], () => import('../routes/Oauth/RedirectToAuthorize')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
  };

  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name,
      authority: routerConfig[item].authority,
    };
  });
  return routerData;
};
