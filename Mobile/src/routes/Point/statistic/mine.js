import React from 'react';
import {
  connect,
} from 'dva';
import echarts from 'echarts';
import moment from 'moment';
import { Flex, WhiteSpace, WingBlank, List } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import MonthPicker from '../../../components/General/MonthPicker';
import { userStorage } from '../../../utils/util';

import style from '../index.less';

const awardOption = {
  color: ['#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'],
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
      center: [50, '50%'],
      type: 'pie',
      radius: ['50%', '70%'],
      label: {
        normal: {
          show: false,
          position: 'center center',
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
      data: [

      ],
    },
  ],
};

@connect(({ statistic }) => ({
  data: statistic.data,
}))
export default class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: userStorage('userInfo'),
    };
  }

  componentWillMount() {
    const datetime = moment(new Date()).format('YYYY-MM');
    this.getStatisticData({ datetime });
  }

  componentDidMount() {
    this.award = echarts.init(document.getElementById('award'));
  }

  componentWillReceiveProps(props) {
    const { award } = this;
    const { data: { monthly } } = props;

    const sourceBMonthly = monthly.source_b_monthly;
    awardOption.legend.data = this.makeLegendData(sourceBMonthly, 'point_b_total');
    awardOption.legend.formatter = name => this.makeLegendPercent(name, sourceBMonthly, 'point_b_total', Math.abs(monthly.point_b_monthly));
    awardOption.series[0].data = this.makeSeriesData(sourceBMonthly, 'point_b_total', Math.abs(monthly.point_b_monthly));

    award.setOption(awardOption);
  }

  getStatisticData =(params) => {
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
    const extra = [
      { value: 0,
        name: total,
        selected: true,
        label: {
          show: true,
          normal: {
            show: true,
            position: 'center',
          },
        } }];
    let newData = (data || []).map((item) => {
      const obj = {};
      obj.value = item[key];
      obj.name = item.name;
      return obj;
    });
    newData = [...extra, ...newData];

    return newData;
  }

  monthChange = (v) => {
    this.getStatisticData({ datetime: v });
  }

  pointRedirect = () => {
    const { history } = this.props;
    history.push('/point_list');
  }

  render() {
    const { data: { monthly } } = this.props;
    const sourceBMonthly = monthly.source_b_monthly;
    const { userInfo = {} } = this.state;
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
            <div
              className={style.players}
              ref={(e) => { this.ptr = e; }}
            >
              <div className={style.aside_title}>当月得分</div>
              <div
                id="award"
                style={{ height: '3.28rem', ...(this.ptr && { width: this.ptr.offsetWidth }) }}
              />
            </div>
          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}
