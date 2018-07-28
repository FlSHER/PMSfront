import React from 'react';
import './index.less';

class Input extends React.Component {
  render() {
    const { value, onChange, type, style, floatNumber } = this.props;
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
        onBlur={() => {
          if (floatNumber) {
            const a = this.ptr.value;
            const b = Number(a);
            const c = b.toFixed(floatNumber);
            let v = c;
            if (Math.floor(c) === Number(v)) {
              v = Number(v);
            }
            onChange(v);
          }
        }
        }
        onChange={() => onChange(this.ptr.value)}
      />
    );
  }
}

Input.defaultProps = {
  type: 'number',
  onBlur: () => {

  },
  floatNumber: 0,
};

export default Input;
