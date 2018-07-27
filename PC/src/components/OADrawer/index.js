import React from 'react';
import { Drawer, Spin } from 'antd';
import styles from './index.less';

export default class OADrawer extends React.Component {
  render() {
    const { footer, children, style, loading } = this.props;
    return (
      <Drawer
        width={400}
        mask={false}
        destroyOnClose
        placement="right"
        wrapClassName={styles.eventInfo}
        onClose={this.props.onClose}
        visible={this.props.visible}
        {...this.props}
        {...footer && { style: { marginBottom: 50, ...style } }}
      >
        <Spin spinning={loading}>
          {children}
        </Spin>
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </Drawer>
    );
  }
}
OADrawer.defaultProps = {
  footer: null,
  loading: false,
};
