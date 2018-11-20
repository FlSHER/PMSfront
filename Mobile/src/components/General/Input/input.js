import React from 'react';
import './index.less';

class Input extends React.Component {
  constructor(props) {
    const { value } = props;
    super(props);
    this.state = {
      value,
    };
  }
  componentWillReceiveProps(props) {
    const { value } = props;
    if (value !== this.props.value) {
      this.setState({
        value,
      });
    }
  }
  makeInputValue = (newValue) => {
    // let value = newValue;
    const { onChange } = this.props;
    // if (range) {
    //   if (parseFloat(value) < range.min) {
    //     value = range.min;
    //   }
    //   if (parseFloat(value) > range.max) {
    //     value = range.max;
    //   }
    // }
    // const numberValue = parseFloat(value);
    // if (Math.floor(numberValue) === numberValue) {
    //   value = Number(value);
    // }
    this.setState({
      value: newValue,
    });
    onChange(newValue);
    // return value;
  }

  formatIntValue = (v, scale, min, max) => {
    // const { scale, min } = field;
    // const value = (v !== '' && min !== '' && (min - v > 0)) ? min : (v - max > 0 ? max : v);
    let value = v;
    if (v !== '') {
      if (min !== '' && min - v > 0) {
        value = min;
      }
      if (max !== '' && v - max > 0) {
        value = max;
      }
    }
    const idx = value.indexOf('.');
    const curScale = idx > -1 ? value.slice(idx + 1).length : 0;
    // const newValue = curScale > scale ? (value.slice(0, value.indexOf('.') + (scale - 0) + 1))
    // : Number(value).toFixed(scale);
    let newValue;
    if (v !== '' && !isNaN(v)) {
      const tmpValue = `${Number(value)}`;
      newValue = curScale > scale ? (tmpValue.slice(0, tmpValue.indexOf('.') + (scale - 0) + 1)) : Number(value).toFixed(scale);
    } else {
      newValue = '';
    }
    return newValue;
  }
  render() {
    const { onChange, type, style, floatNumber, range } = this.props;
    const { value } = this.state;
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
            // const b = Number(a);
            // const c = b.toFixed(floatNumber);
            // let v = b;
            // console.log(v, c);
            // if (Math.floor(c) === Number(c)) {
            //   v = Number(c);
            // }
            // if (range) {
            //   if (parseFloat(v) - range.min < 0) {
            //     v = range.min;
            //   }
            //   if (parseFloat(v) - range.max > 0) {
            //     v = range.max;
            //   }
            // }
           const newValue = this.formatIntValue(a, floatNumber, range.min, range.max);
           this.setState({
             value: newValue,
           });
            onChange(newValue);
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
  value: '',
  range: {
    min: '', max: '',
  },
  floatNumber: 0,
};

export default Input;
