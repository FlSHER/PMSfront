import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Loader.less';

export default class Loader extends React.PureComponent {
  render() {
    const { spinning, fullScreen } = this.props;
    return (
      <div className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
      >
        <div className={styles.warpper}>
          <div className={styles.inner} />
          <div className={styles.text} >加载中</div>
        </div>
      </div>
    );
  }
}
