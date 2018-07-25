import React from 'react';
import { Drawer } from 'antd';
import CheckInfo from '../../common/checkInfo';

export default class extends React.Component {
  render() {
    return (
      <Drawer
        width={640}
        mask={false}
        destroyOnClose
        placement="right"
        onClose={this.onClose}
        visible={this.state.visible}
      >
        <CheckInfo />
      </Drawer>
    );
  }
}
