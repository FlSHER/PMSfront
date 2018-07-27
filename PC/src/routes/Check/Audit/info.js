import React from 'react';
import { connect } from 'dva';
import Drawer from '../../../components/OADrawer';
import CheckInfo from './checkInfo';
import styles from './index.less';

@connect(({ buckle, loading }) => ({
  buckle: buckle.buckleGropusDetails,
  loading: loading.effects['buckle/fetchBuckleGroupsInfo'],
}))
export default class extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetch(nextProps.id);
    }
  }

  fetch = (id) => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'buckle/fetchBuckleGroupsInfo',
        payload: { id },
      });
    }
  }

  renderFooter = () => {
    return (
      <div className={styles.footer}>
        <div><span>通过</span></div>
        <div><span>驳回</span></div>
      </div>
    );
  }
  render() {
    const { id, onClose, loading, buckle, visible } = this.props;
    const data = buckle[id] || {};
    return (
      <Drawer
        visible={visible}
        title="事件详情"
        onClose={onClose}
        loading={loading}
        footer={this.renderFooter()}
      >
        <CheckInfo data={data} />
      </Drawer>
    );
  }
}
