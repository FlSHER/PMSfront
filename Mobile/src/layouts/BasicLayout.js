import React from 'react';
// import PropTypes from 'prop-types';
// import DocumentTitle from 'react-document-title';
// import { connect } from 'dva';
import { Redirect, Switch, Route } from 'dva/router';
// import { ContainerQuery } from 'react-container-query';
// import classNames from 'classnames';
// import { enquireScreen } from 'enquire-js';
// import GlobalHeader from '../components/GlobalHeader';
// import GlobalFooter from '../components/GlobalFooter';
// import LoginLoading from '../components/Loading';
// import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/util';
import Authorized from '../utils/Authorized';
// import { getMenuData } from '../common/menu';
// import logo from '../assets/logo.svg';
import App from '../routes/App';
// const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
// getMenuData().forEach(getRedirect);

export default class BasicLayout extends React.PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <App>
        <Switch>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              )
            )
          }
          {
            redirectData.map(item =>
              <Redirect key={item.from} exact from={item.from} to={item.to} />
            )
          }
          <Redirect exact from="/" to="/home" />
          <Route render={NotFound} />
        </Switch>
      </App>
    );
  }
}
