import React from 'react';
import { Tabs } from 'antd';
import styles from '../../Reward/MyBuckle/index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="我的分组" forceRender>
            222
          </TabPane>
          <TabPane tab="可见分组" key="2" forceRender>
            111
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
