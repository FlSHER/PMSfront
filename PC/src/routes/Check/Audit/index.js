import React from 'react';
import { Tabs } from 'antd';
import CheckList from './List';
import styles from './index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  state = {
    visible: false,
  }

  handleDrawerVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey="1"
          onChange={() => this.handleDrawerVisible(false)}
        >
          <TabPane
            tab="待审核"
            key="1"
          >
            <CheckList onClose={this.handleDrawerVisible} visible={visible} type="processing" forceRender />
          </TabPane>
          <TabPane tab="已审核" key="2">
            <CheckList onClose={this.handleDrawerVisible} visible={visible} type="approved" forceRender />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
