import React from 'react';
import {
  connect,
} from 'dva';
import styles from './common.less';

function IndexPage() {
  return (
    <div className={styles.con}>
      <div>首页</div>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
