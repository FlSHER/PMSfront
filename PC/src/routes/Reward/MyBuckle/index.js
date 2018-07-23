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
            tab="我参与的"
            key="1"
          >
            <Partake type="participant" forceRender />
          </TabPane>
          <TabPane tab="我记录的" key="2">
            <Partake type="recorded" forceRender />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
