import React from 'react';
import {
  connect,
} from 'dva';
import { Button } from 'antd-mobile';
import {
  OA_PATH,
  userStorage,
} from '../../utils/util';

import styles from '../common.less';
import style from './index.less';
// import my_ from '../assets/my_.png';

class My extends React.Component {
    toExit = (e) => {
      e.preventDefault();
      // console.log(`${OA_PATH()}/logout?redirect_uri=http://localhost:8000`)
      localStorage.clear();
      window.location.href = `${OA_PATH()}/logout?redirect_uri=${OA_PATH()}/home`;
    }
    render() {
      const userInfo = userStorage('userInfo');
      return (
        <div
          className={styles.con}
          direction="column"
        >
          <div className={styles.con_content}>
            <div className={style.my}>
              <span>{userInfo.realname}</span>
            </div>
            <div className={style.exit}>
              <Button type="primary" onClick={this.toExit}>退出登录</Button>
            </div>
          </div>

        </div>
      );
    }
}

My.propTypes = {};

export default connect(({ common }) => ({ common }))(My);
