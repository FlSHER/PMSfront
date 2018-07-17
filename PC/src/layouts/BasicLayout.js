import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
// import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/PMSGlobalHeader';
import SiderMenu from '../components/PMSSiderMenu';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import styles from './BasiclLayout.less';
import PageHeader from '../components/PMSPageHeader';

const { Content } = Layout;
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
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

// let isMobile;
// enquireScreen((b) => {
//   isMobile = b;
// });

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  // state = {
  //   isMobile,
  // };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  componentWillMount() {
    this.fetchCurrentUser();
  }

  componentDidMount() {
    this.checkOauthPermission();
    // setInterval(this.checkOauthPermission, 1000);
    // enquireScreen((mobile) => {
    //   this.setState({
    //     isMobile: mobile,
    //   });
    // });
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Ant Design Pro';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }

  fetchCurrentUser = () => {
    this.props.dispatch({
      type: 'currentUser/fetchCurrent',
    });
  }

  checkOauthPermission() {
    if (localStorage.getItem(`${TOKEN_PREFIX}access_token`)
      && localStorage.getItem(`${TOKEN_PREFIX}access_token__expires_in`) > new Date().getTime()) {
      //
    } else if (localStorage.getItem(`${TOKEN_PREFIX}refresh_token`)) {
      this.props.dispatch({
        type: 'oauth/refreshAccessToken',
      });
    } else {
      this.redirectToOaAuthorize();
    }
  }

  redirectToOaAuthorize = () => {
    this.props.dispatch(routerRedux.push('/passport/redirect_to_authorize'));
  }

  render() {
    const {
      currentUser, routerData, match, location, location: { pathname },
    } = this.props;
    const layout = (
      <Layout>
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            location={location}
            menuData={getMenuData()}
          />
          <Content className={styles.container}>
            <PageHeader />
            <Layout className={styles.content}>
              {
                pathname !== '/index' && (
                <SiderMenu
                  location={location}
                  menuData={getMenuData()}
                />
                )
              }
              <Content className={styles.contentView}>
                <div style={{ minHeight: 'calc(100vh - 260px)' }}>
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
                    <Redirect exact from="/" to="/index" />
                    <Route render={NotFound} />
                  </Switch>
                </div>
                <GlobalFooter copyright={<React.Fragment> Copyright <Icon type="copyright" /> 2018 喜歌实业IT部出品</React.Fragment>} />
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => (
            <div className={classNames(params)} style={{ height: '100%' }}>
              {layout}
            </div>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ currentUser, global }) => ({
  currentUser: currentUser.currentUser,
  // loginLoading: loading.models.currentUser,
  collapsed: global.collapsed,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);