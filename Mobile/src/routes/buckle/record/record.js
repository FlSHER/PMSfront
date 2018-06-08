import React from 'react';
import {
  connect,
} from 'dva';
import { List } from 'antd-mobile';
import style from '../index.less';
import styles from '../../common.less';

class BuckleRecord extends React.Component {
  render() {
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <div className={style.parcel}>
            <List>
              <List.Item arrow="horizontal">
                事件标题
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    );
  }
}

BuckleRecord.propTypes = {};

export default connect()(BuckleRecord);
