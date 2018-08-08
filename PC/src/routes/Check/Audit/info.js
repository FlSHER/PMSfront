import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Drawer from '../../../components/OADrawer';
import CheckInfo from './checkInfo';
import CheckForm from './checkForm';
import styles from './index.less';


@connect(({ buckle, loading }) => ({
  buckleInfo: buckle.buckleGropusDetails,
  loading: loading.effects['buckle/fetchBuckleGroupsInfo'],
}))
export default class extends React.Component {
  state = {
    visible: false,
    title: null,
  }

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

  handelVisible = (flag, title) => {
    this.setState({ visible: !!flag, title });
  }

  renderFooter = () => {
    const { editInfo } = this.props;
    const statusId = editInfo.status_id;
    const actionId = statusId === 0 ? 1 : statusId === 1 ? 2 : null;
    const reject = editInfo.first_approved_at && statusId === 1 ? -2 : statusId === 1 ? -1 : null;
    return (
      <div className={styles.footer}>
        <div onClick={() => this.handelVisible(true, actionId)}>
          <span>通过</span>
        </div>
        <div onClick={() => this.handelVisible(true, reject)}>
          <span>驳回</span>
        </div>
      </div>
    );
  }

  renderRecordedFooter = () => {
    const { fetchCancel, id, editInfo, onClose, dispatch } = this.props;
    const statusId = editInfo.status_id;

    return (
      <div className={styles.footer}>
        {([0, 1, -1, -2].indexOf(statusId) !== -1) ? (
          <React.Fragment>
            {[0, 1].indexOf(statusId) !== -1 && (
              <div onClick={() => {
                fetchCancel(id);
                onClose(false);
              }}
              >
                <span>撤回</span>
              </div>
            )}
            <div
              onClick={() => {
                dispatch(routerRedux.push(`/reward/buckle/submission/${id}`));
              }}
            >
              <span>再次提交</span>
            </div>
          </React.Fragment>
        ) :
          (
            <div
              onClick={() => {
                dispatch(routerRedux.push(`/reward/buckle/submission/${id}`));
              }}
            >
              <span>再次提交</span>
            </div>
          )}
      </div>
    );
  }

  render() {
    const { id, onClose, loading, buckleInfo, visible, editInfo, type } = this.props;
    const checkFormVisible = this.state.visible;
    const { title } = this.state;
    const data = buckleInfo[id] || {};
    return (
      <React.Fragment>
        <Drawer
          visible={visible}
          title="事件详情"
          onClose={onClose}
          loading={loading}
          {...(type === 'processing' && { footer: this.renderFooter() })}
          {...(type === 'recorded' && { footer: this.renderRecordedFooter() })}
        >
          <CheckInfo data={data} />
        </Drawer>
        <CheckForm
          title={title}
          editInfo={editInfo}
          visible={checkFormVisible}
          onClose={onClose}
          onCancel={this.handelVisible}
        />
      </React.Fragment>
    );
  }
}
