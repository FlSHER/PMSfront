import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import Partake from './partake';
import styles from './index.less';
import Recorded from '../../Check/Audit/List';

const { TabPane } = Tabs;
@connect(({ tabs }) => ({
  typeId: tabs.reward,
}))
export default class extends React.PureComponent {
  state = {
    visible: false,
    recorded: false,
    addressee: false,
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

  handleAddresseeVisible = (flag) => {
    this.setState({
      addressee: !!flag,
    });
  };

  handleVisible = () => {
    this.setState({
      visible: false,
      recorded: false,
      addressee: false,
    });
  }

  render() {
    const { visible, recorded, addressee } = this.state;
    const { typeId } = this.props;
    return (
      <div className={styles.tabs}>
        <Tabs
          activeKey={typeId}
          defaultActiveKey={typeId}
          onChange={(activeKey) => {
            this.props.dispatch({
              type: 'tabs/save',
              payload: {
                store: 'reward',
                value: activeKey,
              },
            });
            this.handleVisible();
          }}
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
          <TabPane tab="抄送我的" key="3" forceRender>
            <Recorded onClose={this.handleAddresseeVisible} visible={addressee} type="addressee" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
