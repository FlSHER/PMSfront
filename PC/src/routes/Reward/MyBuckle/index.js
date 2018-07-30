import React from 'react';
import { Tabs } from 'antd';
import Partake from './partake';
import styles from './index.less';
import Recorded from '../../Check/Audit/List';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  state = {
    visible: false,
    recorded: false,
  }

  handleDrawerVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  };

  handleRecordedVisible = (flag) => {
    this.setState({
      recorded: !!flag,
    });
  };

  handleVisible = () => {
    this.setState({
      visible: false,
      recorded: false,
    });
  }


  render() {
    const { visible, recorded } = this.state;
    return (
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey="1"
          onChange={() => this.handleVisible()}
        >
          <TabPane
            tab="我参与的"
            key="1"
            forceRender
          >
            <Partake onClose={this.handleDrawerVisible} visible={visible} type="participant" />
          </TabPane>
          <TabPane tab="我记录的" key="2" forceRender>
            <Recorded onClose={this.handleRecordedVisible} visible={recorded} type="recorded" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
