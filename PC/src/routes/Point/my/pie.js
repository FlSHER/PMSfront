import React from 'react';
import echarts from 'echarts';
import styles from './index.less';

const color = ['#c8c8c8', '#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'];

const tooltip = {
  trigger: 'item',
};
const pointCount = {
  value: 0,
  name: '0',
  label: {
    show: true,
    position: 'center',
    fontSize: 16,
  },
  tooltip: {
    show: false,
  },
};
const option = {
  color,
  tooltip,
  legend: {
    orient: 'vertical',
    right: 10,
    itemWidth: 5,
    itemHeight: 5,
    selectedMode: false,
    data: [],
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      center: [80, '50%'],
      radius: [30, 60],
      avoidLabelOverlap: false,
      hoverAnimation: false,
      label: {
        show: false,
      },
      data: [pointCount],
    },
  ],
};


export default class extends React.PureComponent {
  state = {
    myChart: null,
  }

  componentDidMount() {
    this.initEcharts();
  }

  initEcharts = () => {
    this.setState({ myChart: echarts.init(this.pie) });
  }

  reckonPercent = (key, data) => {
    const { total } = this.props;
    const legendLabel = data.find(item => key === item.name) || {};
    let percent = 0;
    if (total) percent = Math.abs((legendLabel.value / total).toFixed(2) * 100);
    return { legendLabel, percent };
  }

  makeLegendFormatter = (data) => {
    return (key) => {
      const { legendLabel, percent } = this.reckonPercent(key, data);
      return `${legendLabel.text}：${percent}%`;
    };
  }

  makeTooltipFormatter = (data) => {
    return (params) => {
      if (!this.props.total) return '0';
      const { legendLabel, percent } = this.reckonPercent(params.name, data);
      return legendLabel.text ? `<span style="display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;background:${params.color}" ></span>${legendLabel.text}：${params.value}分(${percent}%)` : '0';
    };
  }

  render() {
    const { className, data, total, source } = this.props;

    let dataSource = [];
    if (data && data.length) {
      dataSource = data;
    } else if (source && source.length) {
      dataSource = source.map(item => ({ value: 0, name: `key${item.id}`, text: item.name }));
    }
    if (this.state.myChart) {
      const newInitOption = JSON.parse(JSON.stringify({ ...option }));
      const count = {
        ...pointCount,
        name: `${total || 0}`,
      };
      count.value = total === 0 ? 1 : 0;
      newInitOption.series[0].data = [count, ...dataSource];
      newInitOption.legend.data = source.map(item => `key${item.id}`);
      newInitOption.tooltip.formatter = this.makeTooltipFormatter(dataSource);
      newInitOption.legend.formatter = this.makeLegendFormatter(dataSource);
      this.state.myChart.setOption(newInitOption);
    }
    return (
      <div className={`${styles.graphContent} ${styles.pie} ${className}`}>
        <p style={{ marginBottom: 5 }}>{this.props.title}</p>
        <div
          className={styles.graph}
          ref={(e) => { this.pie = e; }}
          style={{ width: 270, height: 120 }}
        />
      </div>
    );
  }
}
