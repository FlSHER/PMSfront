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
    if (localStorage.getItem('OA_refresh_token')
      && localStorage.getItem('OA_access_token_expires_in') < new Date().getTime()) {
      this.props.dispatch({
        type: 'oauth/refreshAccessToken',
      });
    } else if (!localStorage.getItem('OA_access_token')) {
      window.location.href =
        `${OA_PATH()}/oauth/authorize?client_id=${OA_CLIENT_ID()}&response_type=code`;
    } else {
      this.props.dispatch({
        type: 'user/getUserInfo',
      });
    }
  }

  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'user/getUserInfo',
  //   });
  // }

  componentWillReceiveProps() {

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
            <div
              key={pathname}
              className="container"
            // style={{ ...(loading.global ? { display: 'none' } : null) }}
            >
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
