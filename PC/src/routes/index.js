import React, { PureComponent } from 'react';
import { Route, Switch } from 'dva/router';
import { getRoutes } from '../utils/utils';

export default class extends PureComponent {
  render() {
    const { match, routerData, Component } = this.props;
    return (
      <Switch>
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
          ))
        }
        <Component />
      </Switch>
    );
  }
}
