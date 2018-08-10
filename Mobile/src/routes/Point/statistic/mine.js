import React from 'react';
import {
  connect,
} from 'dva';
import ReactDOM from 'react-dom';
import echarts from 'echarts';
import { Flex, WhiteSpace, WingBlank, List } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import CheckBox from '../../../components/ModalFilters/CheckBox';
import MonthPicker from '../../../components/General/MonthPicker';
import { sum, getUrlParams, urlParamsUnicode, sortArr, monthMessage } from '../../../utils/util';
import { pointStyle } from '../../../utils/convert.js';
import style from '../index.less';

const pointCount = {
  value: 0,
  name: '0',
  // selected: true,
  label: {
    show: true,
    position: 'center',
    fontSize: 24,
  },
};
const colorStyle = ['#000', '#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'];
const lineColor = ['#D81E5B', '#0094C6'];
const pieOption = {
  color: colorStyle,
  grid: {
    // top: 18,
    // right: 0,
    containLabel: true,
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 0,
    selectedMode: false,
    top: 0,
    data: [],
  },
  series: [
    {
      name: '访问来源',
      center: [72, '50%'],
      type: 'pie',
      radius: ['60%', '61px'],
      hoverAnimation: false,
      // legendHoverLink: false,
      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: false,
          color: '#000',
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [pointCount],
    },
  ],
};
const lineOption = {
  color: lineColor,
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    type: 'scroll',
    bottom: 0,
    left: 'center',
    data: [
      'A分',
      'B分',
    ],
  },
  grid: {
    // left: '8%',
    bottom: '30',
    top: 20,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    onZeroAxisIndex: -1,
    onZero: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { // x轴
      lineStyle: {
        color: 'rgb(199,199,199)',
        width: 2,
      },
      symbol: ['none', 'arrow'],
    },
    axisLabel: {
      color: 'rgb(74,74,74)',
    },
    axisTick: { // x轴刻度线
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    axisTick: { // y轴刻度线
      show: false,
    },
    splitNumber: 3,
    minInterval: 1,
    scale: true,
    splitLine: false,
    axisLine: { // x轴
      lineStyle: {
        color: 'rgb(199,199,199)',
        width: 2,
      },
      symbol: ['none', 'arrow'],
    },
    axisLabel: {
      color: 'rgb(74,74,74)',
    },
  },
  series: [],
};

const defaultMonthly = [
  {
    id: 0, name: '基础', add_point: 0, sub_point: 0, add_a_point: 0, sub_a_point: 0, point_b_total: 0,
  },
  {
    id: 1, name: '工作', add_point: 0, sub_point: 0, add_a_point: 0, sub_a_point: 0, point_b_total: 0,
  },
  {
    id: 2, name: '行政', add_point: 0, sub_point: 0, add_a_point: 0, sub_a_point: 0, point_b_total: 0,
  },
  {
    id: 3, name: '创新', add_point: 0, sub_point: 0, add_a_point: 0, sub_a_point: 0, point_b_total: 0,
  },
  {
    id: 4, name: '其他', add_point: 0, sub_point: 0, add_a_point: 0, sub_a_point: 0, point_b_total: 0,
  },
];

const tabOptions = [
  { label: 'A分', value: 1, key: 'point_a' },
  { label: 'B分', value: 2, key: 'point_b' },
];

const pointBConfig = [
  { key: 'add_point', title: '当月奖分', name: 'add_point' },
  { key: 'sub_point', title: '当月扣分', name: 'sub_point' },
];

const pointAConfig = [
  { key: 'add_a_point', title: '当月奖分', name: 'add_point' },
  { key: 'sub_a_point', title: '当月扣分', name: 'sub_point' },
];

@connect(({ statistic }) => ({
  data: statistic.data,
}))
export default class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 2,
    };
  }

  componentWillMount() {
    const { location } = this.props;
    // const datetime = moment(new Date()).format('YYYY-MM');
    this.urlParams = getUrlParams(location.search);
    this.getStatisticData({ ...this.urlParams });
  }

  componentDidMount() {
    pointBConfig.forEach((item) => {
      this[`echarts${item.name}`] = echarts.init(this[item.name]);
    });
    this.echartsLine = echarts.init(this.line);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { search } } = nextProps;
    if (search !== this.props.location.search) {
      this.urlParams = getUrlParams(search);
      this.getStatisticData(this.urlParams);
    }
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
        const percent = Math.abs((item[key] / total).toFixed(2)) * 100;
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

  makePieSeriesData = (data, key, total) => {
    const extra = { ...pointCount };
    extra.name = `${total || 0}`;
    let newData = data.filter(item => item[key]).map((item) => {
      const obj = {};
      obj.value = item[key];
      obj.name = item.name;
      obj.itemStyle = {
        color: pointStyle(item.id),
      };
      return obj;
    });
    newData = newData.length > 0 ? newData : [{ value: 1, name: '' }];
    newData = [extra, ...newData];
    return newData;
  }

  makeLineSeriesData = (lineData) => {
    const reverseLineData = [...lineData];
    reverseLineData.reverse();
    const point = {};
    tabOptions.forEach((item) => {
      point[item.key] = [];
    });
    reverseLineData.forEach((item) => {
      tabOptions.forEach(its => point[its.key].push(item[its.key]));
    });
    const seriesData = tabOptions.map((item) => {
      const obj = { type: 'line' };
      obj.name = item.label;
      obj.center = [72, '30%'];
      obj.smooth = true;
      obj.data = [...point[item.key]];
      return obj;
    });
    return seriesData;
  }

  makexAxisData = (xAxis) => {
    const reverseXAxis = [...xAxis];
    reverseXAxis.reverse();
    return reverseXAxis.map(item => monthMessage[item.month]);
  }

  makeyAxisRange = (option, trend) => {
    const yOption = option;
    const pointMinArr = [];
    const pointMaxArr = [];
    trend.forEach((item) => {
      const min = item.point_a < item.point_b ? item.point_a : item.point_b;
      const max = item.point_a > item.point_b ? item.point_a : item.point_b;
      pointMinArr.push(min);
      pointMaxArr.push(max);
    });
    const maxArr = sortArr(pointMaxArr, 'desc');
    const minArr = sortArr(pointMinArr, 'asc');
    const [max] = maxArr;
    const [min] = minArr;
    yOption.max = max + 2;
    yOption.min = min - 2;
    return yOption;
  }

  monthChange = (v) => {
    this.urlParams = {
      ...this.urlParams,
      ...v,
    };
    let url = '/point_statistic';
    const params = urlParamsUnicode(this.urlParams);
    url += params ? `?${params}` : '';
    this.props.history.replace(url);
  }

  tabChange = (v) => {
    this.setState({
      checked: v,
    });
  }

  pointRedirect = () => {
    const { history } = this.props;
    this.clearModal();
    history.push(`/point_list${this.urlParams.staff_sn ? `?staff_sn=${this.urlParams.staff_sn}` : ''}`);
  }

  clearModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alltabs/clearModal',
    });
  }

  renderEsChart = (elementChart, key) => {
    const { data: { monthly } } = this.props;
    const sourceBMonthly = monthly.source_b_monthly || defaultMonthly;
    const sourceAMonthly = monthly.source_a_monthly || defaultMonthly;
    const { checked } = this.state;
    const renderMonthly = checked === 1 ? sourceAMonthly : sourceBMonthly;
    const countArr = renderMonthly.map(item => item[key]);
    const count = sum(countArr);
    const newpieOption = JSON.parse(JSON.stringify(pieOption));
    newpieOption.legend.data = this.makeLegendData(renderMonthly, key);
    newpieOption.legend.formatter = (name) => {
      return this.makeLegendPercent(name, renderMonthly, key, count);
    };
    if (count === 0) {
      newpieOption.color = '#636363';
    }
    newpieOption.series[0].data = this.makePieSeriesData(renderMonthly, key, count);
    elementChart.setOption(newpieOption);
  }

  renderChartLine = () => {
    const { data: { trend } } = this.props;
    const newLineOption = JSON.parse(JSON.stringify(lineOption));
    newLineOption.series = this.makeLineSeriesData(trend);
    newLineOption.xAxis.data = this.makexAxisData(trend);
    // newLineOption.yAxis = this.makeyAxisRange(newLineOption.yAxis, trend);
    this.echartsLine.setOption(newLineOption);
  }

  render() {
    const { data: { monthly } } = this.props;
    const sourceBMonthly = monthly.source_b_monthly || defaultMonthly;
    const sourceAMonthly = monthly.source_a_monthly || defaultMonthly;
    const { checked } = this.state;
    const renderMonthly = checked === 1 ? sourceAMonthly : sourceBMonthly;
    const pointConfig = checked === 1 ? pointAConfig : pointBConfig;
    const currentPoint = checked === 1 ? monthly.point_a_monthly : monthly.point_b_monthly;
    const totalPoint = checked === 1 ? monthly.point_a_total : monthly.point_b_total;
    const { datetime } = this.urlParams;
    const value = datetime ? new Date(datetime) : new Date();
    if (this.echartsLine) {
      this.renderChartLine();
    }
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
                  value={monthly}
                  footer={false}
                  nameKey="staff_name"
                  itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
                />
                <div>
                  <p style={{ fontSize: '14px' }}>{monthly.staff_name}({monthly.staff_sn})</p>
                  <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{monthly.department_name}/{monthly.brand_name}</p>
                </div>
              </div>
              <div className={style.point_total}>
                累计积分：{totalPoint}
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
                  value={value}
                  onChange={v => this.monthChange({ datetime: v })}
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
                  <div className={style.get_point}>{currentPoint}</div>
                </div>
                <div className={style.point_type}>
                  {(renderMonthly || []).map((item, i) => {
                    const idx = i;
                    return (<div key={idx}>{item.name}：{item.add_point}</div>);
                  })}
                </div>
              </Flex>
            </div>
            {pointConfig.map((item) => {
              if (this[`echarts${item.name}`]) {
                this.renderEsChart(this[`echarts${item.name}`], item.key);
              }
              return (
                <div
                  key={item.name}
                  className={style.players}
                  style={{ padding: '0.4rem' }}
                >
                  <div className={style.aside_title}>{item.title}</div>
                  <div
                    ref={(e) => {
                      this[item.name] = ReactDOM.findDOMNode(e);
                    }}
                    style={{ height: '150px', width: '100%' }}
                  />
                </div>
              );
            })}
            <div
              className={style.players}
              style={{ padding: '0.4rem' }}
            >
              <div className={style.aside_title}>变化趋势</div>
              <div
                ref={(e) => {
                  this.line = ReactDOM.findDOMNode(e);
                }}
                style={{ height: '150px', width: '100%' }}
              />
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
        </Flex.Item>
      </Flex>
    );
  }
}
