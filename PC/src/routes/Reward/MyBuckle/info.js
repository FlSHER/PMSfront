import React from 'react';
import { connect } from 'dva';
import Drawer from '../../../components/OADrawer';
import CheckInfo from './content';


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
          visible={visible}
          title="事件详情"
          onClose={() => { onClose(false); }}
          loading={loading}
        >
          <CheckInfo data={data} />
        </Drawer>
      </React.Fragment>
    );
  }
}
