import React from 'react';
import { Picker, Button, Flex } from 'antd-mobile';
// import ModalFilters from '../components/ModalFilters';
import style from './index.less';

export default class TimeRange extends React.Component {
  state={
    date: [0, 0],
  }
  calculateDate = (date1, date2) => {
    const d1 = date1;
    const d2 = date2;
    let m1 = d1.getMonth() === 0 ? 12 : d1.getMonth() + 1;
    let y1 = d1.getFullYear();
    // const d2 = new Date('2018-7');
    const m2 = d2.getMonth() === 0 ? 12 : d2.getMonth();
    const y2 = d2.getFullYear();
    const arr = [];
    while ((y2 === y1 && m1 > m2) || (y2 < y1)) {
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

  monthChange = (date) => {
    this.setState({
      date,
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
    this.monthData = this.calculateDate(new Date(), new Date('2017-2'));
    const startData = this.makeMonthData(this.monthData);
    const { date } = this.state;
    const start = this.monthData[date[0]];
    const end = this.monthData[date[1]];
    const data = [startData, startData];
    // console.log(this.monthData, start, end, data);
    return (
      <Picker
        data={data || []}
        title={this.renderRange()}
        cascade={false}
        value={this.state.date}
        extra="请选择(可选)"
        onChange={v => this.monthChange(v)}
      >
        <Button>选择时间段{`${start.year}-${start.month}至${end.year}-${end.month}`}</Button>
      </Picker>
    );
  }
}
