import React from 'react';
import { Tabs } from 'antd';
import MyGroup from './myGroup';
import VisibleGroup from './visibleGroup';
import styles from '../../Reward/MyBuckle/index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="我的分组" forceRender>
            <MyGroup />
          </TabPane>
          <TabPane tab="可见分组" key="2" forceRender>
            <VisibleGroup />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
