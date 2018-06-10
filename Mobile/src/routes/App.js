/* global window */
import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import {
  withRouter,
} from 'dva/router';
import { FooterBar } from '../components/Footer';
import Loader from '../components/General/Loader/Loader';
import {
  openPages,
} from '../configs/config';
import {
  OA_PATH,
  OA_CLIENT_ID,
} from '../utils/util';
import './app.less';

@withRouter
@connect(({ loading }) => ({
  loading,
}))
export default class App extends React.Component {
  componentWillMount() {
    // if (localStorage.getItem('OA_access_token') &&
    //   localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
    // } else if (localStorage.getItem('OA_refresh_token')) {
    //   this.props.dispatch({
    //     type: 'oauth/refreshAccessToken',
    //   });
    // } else {
    //   window.location.href =
    // `${OA_PATH()}/oauth/authorize?client_id=${OA_CLIENT_ID()}&response_type=code`;
    // }
    return `${OA_PATH()}&${OA_CLIENT_ID()}`;
  }


  render() {
    const {
      loading,
      children,
      location,
    } = this.props;
    let {
      pathname,
    } = location;

    pathname = pathname.startsWith('/') ? pathname : `/ ${pathname} `;
    return (
      <React.Fragment>
        <div key={pathname}>
          <QueueAnim>
            <div key={pathname} className="container">
              {children}
            </div>
          </QueueAnim>
        </div>
        <Loader fullScreen spinning={loading.global} />
        {
          openPages && openPages.includes(pathname) ? (
            <FooterBar
              history={this.props.history}
              pathname={pathname}
            />
          ) : ''
        }
      </React.Fragment>
    );
  }
}
