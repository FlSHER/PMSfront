import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import style from '../index.less';
import styles from '../../common.less';

@connect()
export default class PointDetail extends React.Component {
  render() {
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel} />
        </div>
      </div>
    );
  }
}

