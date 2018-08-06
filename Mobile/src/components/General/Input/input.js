import React from 'react';
import './index.less';

class Input extends React.Component {
  makeInputValue = (newValue) => {
    let value = newValue;
    const { range, onChange } = this.props;
    if (range) {
      if (parseFloat(value) < range.min) {
        value = range.min;
      }
      if (parseFloat(value) > range.max) {
        value = range.max;
      }
    }
    // const numberValue = parseFloat(value);
    // if (Math.floor(numberValue) === numberValue) {
    //   value = Number(value);
    // }
    onChange(value);
    // return value;
  }
  render() {
    const { value, onChange, type, style, floatNumber } = this.props;
    return (
      <input
        value={`${value}`}
        style={style}
        type={type}
        ref={(e) => { this.ptr = e; }}
        onFocus={(e) => {
          e.target.focused = true;
          e.target.select();
         }}
        onBlur={() => {
          if (floatNumber) {
            const a = this.ptr.value;
            const b = Number(a);
            const c = b.toFixed(floatNumber);
            let v = b;
            if (Math.floor(c) === Number(c)) {
              v = Number(c);
            }
            onChange(v);
          }
        }
        }
        onChange={() => this.makeInputValue(this.ptr.value)}
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
