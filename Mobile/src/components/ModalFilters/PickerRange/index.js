import React from 'react';
import { DatePicker, Flex } from 'antd-mobile';
import moment from 'moment';
import style from '../index.less';

const defaultValue = {
  min: '',
  max: moment(new Date()).format('YYYY-MM'),
};
class PickerRange extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value: value || defaultValue,
      // focus: 'start_at',
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
        [key]: moment(newValue).format('YYYY-MM-DD'),
      },
    }, () => {
      onChange(this.state.value);
    });
  }

  render() {
    const { value: { min, max } } = this.state;
    const { addonBefore } = this.props;
    return (
      <Flex>
        {addonBefore}
        <Flex.Item>
          <DatePicker
            mode="date"
            format="YYYY-MM-DD"
            onChange={date => this.handleOnChange('min', date)}
          >
            <div className={style.some_time}>{min}</div>
          </DatePicker>
        </Flex.Item>
        <Flex.Item>
          <DatePicker
            mode="date"
            format="YYYY-MM-DD"
            onChange={date => this.handleOnChange('max', date)}
          >
            <div className={style.some_time}>{max}</div>
          </DatePicker>
        </Flex.Item>
      </Flex>

    );
  }
}
PickerRange.defaultProps = {
  min: null,
  max: null,
  addonBefore: null,
  onChange: () => { },
};

export default PickerRange;
