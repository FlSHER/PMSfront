import React from 'react';
import { Icon } from 'antd';
import styles from '../index.less';

function CircleTag(props) {
  const { afterClose, closable, style, onClick, children } = props;
  return (
    <div
      onClick={onClick}
      className={styles.circlContent}
      style={style}
    >
      <div className={styles.iconfont}>
        <Icon type="user" />
        {closable && <Icon type="close" className={styles.close} onClick={() => afterClose} />}
      </div>
      <div style={{ lineHeight: '16px', paddingTop: 3 }}>{children}</div>
    </div>
  );
}
export default CircleTag;
