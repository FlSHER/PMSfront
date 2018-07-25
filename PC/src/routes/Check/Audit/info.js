import React from 'react';
import { Drawer } from 'antd';
import CheckInfo from '../../common/checkInfo';
import styles from './index.less';

export default class extends React.Component {
  render() {
    return (
      <Drawer
        width={400}
        mask={false}
        destroyOnClose
        placement="right"
        title="事件详情"
        wrapClassName={styles.eventInfo}
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <CheckInfo />
      </Drawer>
    );
  }
}
