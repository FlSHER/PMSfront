/* global window */
import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import {
  withRouter,
} from 'dva/router';
import Footer from '../components/Footer/Footer';
import Loader from '../components/General/Loader/Loader';
import {
  openPages,
} from '../configs/config';
import {
  OA_PATH,
  OA_CLIENT_ID,
} from '../utils/util';
import style from './app.less';

class App extends React.Component {
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
      <div className={style.container}>
        <Loader
          fullScreen
          spinning={loading.global}
        />
        <div
          className={style.content}
          key={pathname}
        >
          <QueueAnim
            className={style.demo_content}
            type={['left', 'right']}
          >
            <div
              key={pathname}
              style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
            >
              {children}
            </div>
          </QueueAnim>
        </div>
        {
          openPages && openPages.includes(pathname) ? (
            <div className={style.footer}>
              <Footer
                history={this.props.history}
                pathname={pathname}
              />
            </div>
) : ''
        }
      </div>
    );
  }
}

export default withRouter(connect(({
  loading,
}) => ({
  loading,
}))(App));
