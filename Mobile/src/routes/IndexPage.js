import React from 'react';
import {
  connect,
} from 'dva';
import { Link } from 'dva/router';
import styles from './common.less';

function IndexPage() {
  return (
    <div className={styles.con}>
      <div>首页</div>
      <Link to="/testView" style={{ margin: '20px' }}><h1>搜索插件</h1></Link>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
