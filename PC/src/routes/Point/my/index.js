import React from 'react';
import { Tabs } from 'antd';
import ThisMonth from './thisMonth';
import Accumulative from './accumulative';
import styles from '../../Reward/MyBuckle/index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="2">
          <TabPane key="1" tab="当月积分" forceRender>
            <ThisMonth />
          </TabPane>
          <TabPane tab="累计积分" key="2" forceRender>
            <Accumulative />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
