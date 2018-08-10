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

export const color = ['#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'];
export const xAxisData = ['固定', '系统', '奖扣', '其他', '基础'];
const itemStyle = color.map(item => ({ color: item }));
const values = [-120, 120, 60, 60, 40];
const data = values.map((item, index) => ({ value: item, itemStyle: itemStyle[index] }));
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
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
    data: xAxisData,
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
    data,
  }],
};


export default class extends React.PureComponent {
  componentDidMount() {
    this.myChart = echarts.init(this.test);
    this.myChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.graphContent}>
        <div
          className={styles.graph}
          ref={(e) => { this.test = e; }}
          style={{ width: 270, height: 260 }}
        />
      </div>
    );
  }
}
