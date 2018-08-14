import React from 'react';
import echarts from 'echarts';
import styles from './index.less';

const colors = ['#cf4252', '#59c3c3'];


/**
 * 刻度线
 */
const axisTick = {
  show: true,
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
  show: true,
  lineStyle: {
    color: '#969696',
  },
};

const option = {
  color: colors,

  tooltip: {
    trigger: 'item',
  },
  legend: {
    data: ['A分', 'B分'],
    zoomLock: 20,
    top: 0,
  },
  grid: {
    top: 30,
    bottom: 30,
  },
  xAxis: [
    {
      type: 'category',
      axisTick,
      axisLine: {
        ...axisLine,
        show: true,
        // onZero: false,
      },
      axisLabel: {
        show: true,
      },
      data: ['2018-1', '2018-2', '2018-3', '2018-4', '2018-5', '2018-6', '2018-7', '2018-8', '2018-9', '2018-10', '2018-11', '2018-12'],
    },
  ],
  yAxis: [
    {
      type: 'value',
      splitArea: false,
      splitLine,
      axisTick,
      axisLine,
    },
  ],
  dataZoom: [{
    type: 'inside',
    zoomLock: true,
    start: 0,
    end: 50,
  }],
  series: [
    {
      name: 'A分',
      type: 'line',
      smooth: true,
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
    },
    {
      name: 'B分',
      type: 'line',
      smooth: true,
      data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7],
    },
  ],
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
          style={{ width: 350, height: 260 }}
        />
      </div>
    );
  }
}
