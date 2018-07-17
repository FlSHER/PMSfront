import React from 'react';
import {
  connect,
} from 'dva';
import ReactDOM from 'react-dom';
import echarts from 'echarts';
import moment from 'moment';
import { Flex, WhiteSpace, WingBlank, List } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import CheckBox from '../../../components/ModalFilters/CheckBox';
import MonthPicker from '../../../components/General/MonthPicker';
import { userStorage } from '../../../utils/util';

import style from '../index.less';

const pointCount = {
  value: 0,
  name: '1548',
  selected: true,
  label: {
    show: true,
    position: 'center',
    fontSize: 24,
    padding: [23, 0, 0, 0],
  },
};

const awardOption = {
  color: ['#000', '#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'],
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 0,
    top: 0,
    data: [],
  },
  series: [
    {
      name: '访问来源',
      center: [72, '50%'],
      type: 'pie',
      radius: ['60%', '61px'],
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: true,
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [],
    },
  ],
};

const tabOptions = [
  { label: 'A分', value: 1 },
  { label: 'B分', value: 2 },
];
const pointConfig = [
  { key: 'add_point', title: '当月奖分', total: 'add_point_total' },
  { key: 'sub_point', title: '当月扣分', total: 'sub_point_total' },
];
@connect(({ statistic }) => ({
  data: statistic.data,
}))
export default class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: userStorage('userInfo'),
      checked: 2,
    };
  }

  componentWillMount() {
    const datetime = moment(new Date()).format('YYYY-MM');
    this.getStatisticData({ datetime });
  }

  componentDidMount() {
    pointConfig.forEach((item) => {
      this[`echarts${item.key}`] = echarts.init(this[item.key]);
    });
  }


  getStatisticData = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistic/pointStatistic',
      payload: { ...params },
    });
  }

  makeLegendPercent = (name, data, key, total) => {
    const newData = (data || []).filter(item => item[key]);
    let desc = '';
    newData.forEach((item) => {
      if (item.name === name) {
        const percent = (item[key] / total).toFixed(2) * 100;
        const des = `${item.name}:${percent}%`;
        desc = des;
      }
    });
    return desc;
  }

  makeLegendData = (data, key) => {
    const legend = (data || []).filter(item => item[key]).map(its => its.name);
    return legend;
  }

  makeSeriesData = (data, key, total) => {
    const extra = pointCount;
    extra.name = total;
    let newData = (data || []).map((item) => {
      const obj = {};
      obj.value = item[key];
      obj.name = item.name;
      return obj;
    });
    newData = [extra, ...newData];
    return newData;
  }

  monthChange = (v) => {
    this.getStatisticData({ datetime: v });
  }

  tabChange = (v) => {
    this.setState({
      checked: v,
    });
    this.getStatisticData({ datetime: v });
  }

  pointRedirect = () => {
    const { history } = this.props;
    history.push('/point_list');
  }

  renderEsChart = (elementChart, key, total) => {
    const { data: { monthly } } = this.props;
    const sourceBMonthly = monthly.source_b_monthly;
    const count = Math.abs(monthly[total]);
    awardOption.legend.data = this.makeLegendData(sourceBMonthly, key);
    awardOption.legend.formatter = (name) => {
      return this.makeLegendPercent(name, sourceBMonthly, key, count);
    };
    awardOption.series[0].data = this.makeSeriesData(sourceBMonthly, key, count);
    elementChart.setOption(awardOption);
  }

  render() {
    const { data: { monthly } } = this.props;
    const sourceBMonthly = monthly.source_b_monthly;
    const { userInfo = {}, checked } = this.state;
    return (
      <Flex direction="column">
        <Flex.Item
          className={style.content}
        >
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.header_info}>
              <div className={style.ranking_user_info}>
                <PersonIcon
                  value={userInfo}
                  footer={false}
                  nameKey="realname"
                  itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
                />
                <div>
                  <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
                  <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{userInfo.department && userInfo.department.full_name}/{userInfo.brand && userInfo.brand.name}</p>
                </div>
              </div>
              <div className={style.point_total}>
                累计积分：{monthly.point_b_total}
              </div>
            </div>
            <List>
              <List.Item arrow="horizontal" onClick={this.pointRedirect}>积分明细</List.Item>
            </List>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.players}>
              <Flex className={style.time_sel}>
                <MonthPicker
                  onChange={this.monthChange}
                />
              </Flex>
            </div>
            <div className={style.players} style={{ padding: '0.4rem' }}>
              <CheckBox
                options={tabOptions}
                multiple={false}
                value={checked}
                onChange={this.tabChange}
              />
              <Flex align="start" className={style.data_item}>
                <div className={style.aside}>
                  <div className={style.aside_title}>当月得分</div>
                  <div className={style.get_point}>{monthly.point_b_monthly}</div>
                </div>
                <div className={style.point_type}>
                  {(sourceBMonthly || []).map((item, i) => {
                    const idx = i;
                    return (<div key={idx}>{item.name}：{item.add_point}</div>);
                  })}
                </div>
              </Flex>
            </div>
            {pointConfig.map((item) => {
              if (this[`echarts${item.key}`]) {
                this.renderEsChart(this[`echarts${item.key}`], item.key, item.total);
              }
              return (
                <div
                  key={item.key}
                  className={style.players}
                >
                  <div className={style.aside_title}>{item.title}</div>
                  <div
                    ref={(e) => {
                      this[item.key] = ReactDOM.findDOMNode(e);
                    }}
                    style={{ height: '3.8133rem', width: '100%' }}
                  />
                </div>
              );
            })}

          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}
