import React from 'react';
import { Picker, Flex } from 'antd-mobile';
// import ModalFilters from '../components/ModalFilters';
import style from './index.less';

export default class TimeRange extends React.Component {
  constructor(props) {
    super(props);
    const { value, range, distance } = props;
    this.monthData = this.calculateDate(range.max, range.min);
    const maxValue = value.max;
    const minValue = value.min;
    let maxIndex = 0;
    let minIndex = distance > this.monthData.length ? this.monthData.length - 1 : distance;
    for (let i = 0; i < this.monthData.length; i += 1) {
      const item = this.monthData[i];
      if (`${item.year}` === `${new Date(maxValue).getFullYear()}`
       && `${item.month}` === `${new Date(maxValue).getMonth() + 1}`) { maxIndex = i; }
      if (`${item.year}` === `${new Date(minValue).getFullYear()}`
       && `${item.month}` === `${new Date(minValue).getMonth() + 1}`) { minIndex = i; }
    }
    this.state = {
      date: [minIndex, maxIndex],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, range, distance } = nextProps;
    const { min, max } = range;
    this.monthData = this.calculateDate(max, min);
    const maxValue = value.max;
    const minValue = value.min;
    let maxIndex = 0;
    let minIndex = distance > this.monthData.length ? this.monthData.length - 1 : distance;
    for (let i = 0; i < this.monthData.length; i += 1) {
      const item = this.monthData[i];
      if (`${item.year}` === `${new Date(maxValue).getFullYear()}`
       && `${item.month}` === `${new Date(maxValue).getMonth() + 1}`) { maxIndex = i; }
      if (`${item.year}` === `${new Date(minValue).getFullYear()}`
       && `${item.month}` === `${new Date(minValue).getMonth() + 1}`) { minIndex = i; }
    }
    // const valueMin = distance > this.monthData.length ? this.monthData.length : distance;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        date: [minIndex, maxIndex],
      });
    }
  }

  calculateDate = (date1, date2) => {
    const d1 = date1;
    const d2 = date2;
    let m1 = d1.getMonth() + 1;
    let y1 = d1.getFullYear();
    const m2 = d2.getMonth();
    const y2 = d2.getFullYear();
    const arr = [];
    while ((y2 === y1 && !(m2 > m1)) || (y2 < y1)) {
      const obj = {};
      obj.month = m1;
      obj.year = y1;
      arr.push(obj);
      m1 -= 1;
      if (m1 === 0) {
        m1 = 12;
        y1 -= 1;
      }
      if (m1 === m2 && y2 === y1) {
        break;
      }
    }
    this.monthData = arr;
    return arr;
  }

  makeMonthData = () => {
    const dateData = (this.monthData || []).map((item, index) => {
      const obj = {};
      const str = `${item.year}-${item.month}`;
      obj.label = str;
      obj.value = index;
      return obj;
    });
    return dateData;
  }

  handleOnChange = (date) => {
    const { onChange } = this.props;
    const start = this.monthData[date[0]];
    const end = this.monthData[date[1]];

    this.setState({
      date,
    }, () => {
      const newStart = `${start.year}-${start.month}`;
      const newEnd = `${end.year}-${end.month}`;
      onChange(newStart, newEnd);
    });
  }

  renderRange = () => {
    return (
      <Flex
        align="center"
        justify="around"
        style={{ width: '100%' }}
        className={style.range_time}
      >
        <Flex.Item
          className={style.item}
        >
          <span >
           开始时间
          </span>
        </Flex.Item>
        <Flex.Item
          className={style.item}
          style={{ textAlign: 'right' }}
        >
          <span >
           结束时间
          </span>
        </Flex.Item>
      </Flex>
    );
  }

  render() {
    this.startData = this.makeMonthData(this.monthData);
    const { date } = this.state;
    this.start = this.monthData[date[0]];
    this.end = this.monthData[date[1]];
    const data = [this.startData, this.startData];
    return (
      <Picker
        data={data || []}
        title={this.renderRange()}
        cascade={false}
        value={this.state.date}
        extra="请选择(可选)"
        onChange={v => this.handleOnChange(v)}
      >
        <div
          className={[style.filter, style.cancelbg].join(' ')}
        ><span>{`${this.start.year}-${this.start.month} 至 ${this.end.year}-${this.end.month}`}</span>
        </div>
      </Picker>
    );
  }
}
