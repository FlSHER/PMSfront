import React from 'react';

import {
  connect,
} from 'dva';
import style from './index.less';

class Label extends React.Component {
  convertStyle = (status) => {
    switch (status) {
      case -2: return 'label_state_0';
      case -1: return 'label_state_1';
      case 0: return 'label_state_3';
      case 1:
      case 2: return 'label_state_2';
      default: return 'label_state_default';
    }
  }
  render() {
    const { value, content } = this.props;

    return (
      <div
        className={style[this.convertStyle(value.status_id)]}
        style={{ display: 'inline-block' }}
      >
        {content}
      </div>
    );
  }
}

Label.propTypes = {};

export default connect()(Label);
