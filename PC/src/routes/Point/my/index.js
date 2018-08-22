import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import ThisMonth from './thisMonth';
import Accumulative from './accumulative';
import PointDetail from '../detail';
import styles from '../../Reward/MyBuckle/index.less';

const { TabPane } = Tabs;
@connect(({ table }) => ({ contentHeight: table.contentHeight }))
export default class extends React.PureComponent {
  render() {
    const { staffSn, contentHeight, datetime } = this.props;
    const clientHeight = contentHeight || document.getElementById('rightContent').clientHeight;
    const viewHeight = clientHeight - 80;
    const style = { height: viewHeight, overflowY: 'scroll' };
    return (
      <div className={styles.tabs}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="当月积分" forceRender style={style}>
            <ThisMonth staffSn={staffSn} datetime={datetime} />
          </TabPane>
          <TabPane tab="累计积分" key="2" forceRender style={style}>
            <Accumulative staffSn={staffSn} />
          </TabPane>
          <TabPane tab="积分明细" key="3">
            <PointDetail staffSn={staffSn} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
