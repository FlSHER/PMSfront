import React from 'react';
import './index.less';

class Input extends React.Component {
  render() {
    const { value, onChange, type, style, onBlur } = this.props;
    return (
      <input
        value={value}
        style={style}
        type={type}
        ref={(e) => { this.ptr = e; }}
        onFocus={() => { this.ptr.focused = true; this.ptr.select(); }}
        onMouseUp={() => {
          if (this.ptr.focused) { this.ptr.focused = false; this.ptr.select(); return false; }
        }}
        onBlur={() => onBlur(this.ptr.value)}
        onChange={() => onChange(this.ptr.value)}
      />
    );
  }
}

Input.defaultProps = {
  type: 'number',
  onBlur: () => {

  },
};

export default Input;
