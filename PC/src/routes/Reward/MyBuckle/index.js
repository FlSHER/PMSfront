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
            style={{ width: 56 }}
           />
          <TabPane tab="我记录的" key="3">Tab 3</TabPane>
        </Tabs>
      </div>
    );
  }
}
