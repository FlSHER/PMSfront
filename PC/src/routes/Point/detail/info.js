import React from 'react';
import { connect } from 'dva';
import Drawer from '../../../components/OADrawer';
import styles from './index.less';

@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetch'],
}))
export default class extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetch(nextProps.id);
    }
  }

  fetch = (id) => {
    const { dispatch, type } = this.props;
    if (id) {
      dispatch({
        type: 'buckle/fetch',
        payload: { id, type },
      });
    }
  }

  render() {
    const { id, onClose, loading, buckle, visible, type } = this.props;
    const data = buckle[`${type}Details`][id] || {};
    return (
      <React.Fragment>
        <Drawer
          visible
          title="事件详情"
          onClose={() => { onClose(false); }}
          loading={loading}
        >
          <p className={styles.title}>张博涵的积分明细</p>
          <p className={styles.staffInfo}>
            <span className={styles.staffSn}>员工编号：110105</span>
            <span className={styles.dpt}>所属部门：IT部-开发组</span>
          </p>

          <p className={styles.point}>
            <span>基础分</span>
            <span style={{ fontSize: '24px', lineHeight: '22px', float: 'right' }}>2000</span>
          </p>
        </Drawer>
      </React.Fragment>
    );
  }
}
