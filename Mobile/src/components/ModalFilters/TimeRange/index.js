import React from 'react';
import { DatePicker, Flex } from 'antd-mobile';
import moment from 'moment';
import style from './index.less';

const defaultValue = {
  start_at: moment(new Date()).format('YYYY-MM'),
  end_at: '',
};
class TimeRange extends React.Component {
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
          start_at: value.start_at,
          end_at: value.end_at,
        },
      });
    }
  }

  onFocus = (name) => {
    console.log(name);
    // this.setState({ focus: name });
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

  saveTime = (date, index) => {
    console.log(date, index);
    // const { value, focus } = this.state;
    // this.setState({
    //   value: {
    //     ...value,
    //     [focus]: date.join('-'),
    //   },
    // });
  }


  renderRange = () => {
    const { value } = this.state;
    const startName = focus === 'start_at' ? style.active : null;
    const endName = focus === 'end_at' ? style.active : null;
    return (
      <Flex
        align="center"
        style={{ width: '100%' }}
        className={style.range_time}
      >
        <Flex.Item
          className={style.item}
          onClick={() => { this.onFocus('start_at'); }}
        >
          <span className={startName}>
            {value.start_at}
          </span>
        </Flex.Item>
        <Flex.Item className={[style.item, style.middle].join(' ')}>至</Flex.Item>
        <Flex.Item
          onClick={() => { this.onFocus('end_at'); }}
          className={style.item}
        >
          <span className={endName}>
            {value.end_at}
          </span>
        </Flex.Item>
      </Flex>
    );
  }

  render() {
    // const { value, focus } = this.state;
    return (
      <DatePicker
        // value={value[focus]}
        // onValueChange={this.saveTime}
        onChange={this.saveTime}
        mode="datetime"
      // title={this.renderRange()}
      >
        <div
          className={[style.filter].join(' ')}
        >111
        </div>
      </DatePicker>
    );
  }
}
TimeRange.defaultProps = {

};
export default TimeRange;
