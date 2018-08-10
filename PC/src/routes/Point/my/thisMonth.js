import React from 'react';
import Bar from './bar';
import Pie from './pie';
import styles from './index.less';

export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.content}>
        <div className={styles.itemLeft}>
          <Bar />
          <Pie />
        </div>
        <div className={styles.itemRight}>
          <Bar />
          <Pie />
        </div>
      </div>
    );
  }
}
