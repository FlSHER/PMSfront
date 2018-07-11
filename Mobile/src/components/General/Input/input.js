import React from 'react';

import {
  connect,
} from 'dva';
import './index.less';

class Input extends React.Component {
  render() {
    const { value, onChange, type, style } = this.props;
    return (
      <input
        value={value}
        style={style}
        type={type}
        ref={(e) => { this.ptr = e; }}
        onFocus={() => { this.ptr.select(); }}
        onChange={() => onChange(this.ptr.value)}
      />
    );
  }
}

Input.defaultProps = {
  type: 'number',
};

export default connect()(Input);
