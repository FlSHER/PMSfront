import React from 'react';
import { Tabs } from 'antd';
import Partake from './partake';
import styles from './index.less';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  render() {
    return (
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="1" >
          <TabPane
            tab="待审核"
            key="1"
          >
            <Partake type="processing" forceRender />
          </TabPane>
          <TabPane tab="已审核" key="2">
            <Partake type="approved" forceRender />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
