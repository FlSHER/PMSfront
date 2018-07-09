import React from 'react';
import { Flex, InputItem } from 'antd-mobile';
import style from '../index.less';

const defaultValue = {
  min: '',
  max: '',
};

class InputRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || defaultValue,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value: {
          min: value.min,
          max: value.max,
        },
      });
    }
  }

  handleOnChange = (key, newValue) => {
    const { value } = this.state;
    const { onChange } = this.props;
    this.setState({
      value: {
        ...value,
        [key]: newValue,
      },
    }, () => {
      onChange(this.state.value);
    });
  }

  render() {
    const { value: { min, max } } = this.state;
    const { addonBefore } = this.props;
    return (
      <Flex align="center">
        {addonBefore}
        <InputItem
          value={min}
          onChange={value => this.handleOnChange('min', value)}
        />
        <span className={style.rg}>—</span>
        <InputItem
          value={max}
          onChange={value => this.handleOnChange('max', value)}
        />
      </Flex>
    );
  }
}
InputRange.defaultProps = {
  min: null,
  max: null,
  addonBefore: null,
  onChange: () => { },
};
export default InputRange;
