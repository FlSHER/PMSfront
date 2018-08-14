import React from 'react';
import echarts from 'echarts';
import styles from './index.less';

/**
 * 刻度线
 */
const axisTick = {
  show: false,
};

/**
 *  分割轴线
 */
const splitLine = {
  lineStyle: {
    color: ['#dcdcdc'],
    type: 'dashed',
  },
};

const axisLine = {
  show: false,
  lineStyle: {
    color: '#969696',
  },
};
const color = ['#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'];
const option = {
  color,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  grid: {
    top: '5',
    left: '5',
    right: '1',
    bottom: '10',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    axisTick,
    axisLine: {
      ...axisLine,
      show: true,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitArea: false,
    splitLine,
    axisTick,
    axisLine,
  },
  series: [{
    type: 'bar',
    barMaxWidth: 20,
  }],
};


export default class extends React.PureComponent {
  componentDidMount() {
    this.myChart = echarts.init(this.bar);
  }

  makeSeriesDataTextColor = (data) => {
    const newData = data.map((item, index) => {
      return { ...item, itemStyle: { color: color[index] } };
    });
    return [...newData];
  }

  render() {
    const { data, source } = this.props;
    let dataSource = [];
    if (data && data.length) {
      dataSource = data;
    } else if (source && source.length) {
      dataSource = source.map(item => ({ value: 0, name: item.name }));
    }
    if (this.myChart) {
      const newInitOption = JSON.parse(JSON.stringify({ ...option }));
      newInitOption.xAxis.data = data.map(item => item.name);
      newInitOption.series[0].data = this.makeSeriesDataTextColor(dataSource);
      this.myChart.setOption(newInitOption);
    }
    return (
      <div className={styles.graphContent}>
        <div
          className={styles.graph}
          ref={(e) => { this.bar = e; }}
          style={{ width: 270, height: 260 }}
        />
      </div>
    );
  }
}
