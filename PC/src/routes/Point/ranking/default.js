import React from 'react';
import { Tabs } from 'antd';
import GroupView from './group';
import styles from '../../Reward/MyBuckle/index.less';
import { getUrlString } from '../../../utils/utils';

const { TabPane } = Tabs;
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const activeKey = getUrlString('activeKey') || '1';
    this.state = {
      activeKey,
    };
  }

  render() {
    const key = this.state.activeKey;
    return (
      <div className={styles.tabs}>
        <Tabs
          defaultActiveKey="1"
          activeKey={key}
          onChange={activeKey => this.setState({ activeKey })}
        >
          <TabPane key="1" tab="我的分组" forceRender>
            <GroupView
              type="auth_group"
              activeKey={key}

            />
          </TabPane>
          <TabPane tab="可见分组" key="2" forceRender>
            <GroupView
              type="statis_group"
              activeKey={key}

            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
