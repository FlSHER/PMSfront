import React from 'react';
import { Progress, Radio } from 'antd';
import moment from 'moment';
import { DatePicker } from '../../../components/OAForm';
import OATable from '../../../components/OATable';
import styles from './index.less';

const RadioGroup = Radio.Group;

const dataSource = [{
  rangking: '1',
  realname: '胡彦斌',
  point: 102,
}, {
  rangking: '2',
  realname: '胡彦祖',
  point: 42,
}];

const columns = [{
  title: '排名',
  width: 90,
  dataIndex: 'rangking',
}, {
  title: '姓名',
  width: 150,
  dataIndex: 'realname',
  searcher: true,
}, {
  title: '积分',
  dataIndex: 'point',
  sorter: true,
  width: 370,
  render(point) {
    const percent = (point / 102).toFixed(2) * 100;
    return (
      <React.Fragment>
        {point}
        <span style={{ display: 'inline-block', width: '300px', float: 'right' }}>
          <Progress
            percent={percent}
            strokeColor="#59c3c3"
            showInfo={false}
          />
        </span>
      </React.Fragment>
    );
  },
}, {
  title: '操作',
  width: 90,
  render() {
    return (
      <React.Fragment>
        <a style={{ color: '#59c3c3' }}>查看</a>
      </React.Fragment>
    );
  },
}];

const format = 'YYYY-MM';
const thisMonth = moment().format(format);
export default class extends React.Component {
  state = {
    value: 1,
    open: false,
    date: thisMonth,
  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      value,
    });
  }

  handlePanelChange = (date) => {
    this.setState({
      date: moment(date).format(format),
      open: false,
    });
  }

  handleDatePickerVisible = (flag) => {
    this.setState({ value: 1, open: !!flag });
  }

  render() {
    const { value, open, date } = this.state;
    return (
      <div className={styles.container}>
        <RadioGroup className={styles.header} onChange={this.onChange} value={value}>
          <Radio value={1}>
            月度排名
            <DatePicker
              open={open}
              mode="month"
              format={format}
              value={date}
              allowClear={false}
              onPanelChange={this.handlePanelChange}
              onFocus={() => this.handleDatePickerVisible(true)}
              onBlur={() => this.handleDatePickerVisible(false)}
              style={{ width: '120px', marginLeft: '10px' }}
            />
          </Radio>
          <Radio value={2}>累计排名</Radio>
        </RadioGroup>

        <div className={styles.myRangking}>
          <span>我的排名：1</span>
          <span>我的积分：2000</span>
        </div>
        <OATable
          columns={columns}
          dataSource={dataSource}
          operatorVisble={false}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
    );
  }
}
