import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
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

const seriesItem = {
  type: 'line',
  smooth: true,
};

const option = {
  color: [],
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [],
    zoomLock: 20,
    top: 0,
  },
  grid: {
    top: 30,
    left: 40,
    right: 10,
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
    start: 100,
    end: 10,
  }],
  series: [],
};

export default class extends React.PureComponent {
  state = {
    myChart: null,
  }

  componentDidMount() {
    this.initEcharts();
  }

  initEcharts = () => {
    this.setState({ myChart: echarts.init(this.line) });
  }

  render() {
    const { data, width, height } = this.props;
    const { myChart } = this.state;
    const rangDate = data.month;
    const xAxisData = rangDate;
    if (!rangDate.length) {
      for (let i = 1; i < 13; i += 1) {
        xAxisData.push(`${moment().year()}-${i}`);
      }
    }
    const { aTotal, bTotal } = data;
    if (myChart) {
      const newInitOption = JSON.parse(JSON.stringify({ ...option }));
      newInitOption.xAxis[0].data = xAxisData;
      if (aTotal) {
        newInitOption.color.push(colors[0]);
        newInitOption.legend.data.push('A分');
        newInitOption.series.push({
          ...seriesItem,
          name: 'A分',
          data: aTotal,
        });
      }
      if (bTotal) {
        newInitOption.color.push(colors[1]);
        newInitOption.legend.data.push('B分');
        newInitOption.series.push({
          ...seriesItem,
          name: 'B分',
          data: bTotal,
        });
      }
      this.state.myChart.setOption(newInitOption);
    }
    return (
      <div className={styles.graphContent}>
        <div
          className={styles.graph}
          ref={(e) => { this.line = e; }}
          style={{ width: width || 350, height: height || 260 }}
        />
      </div>
    );
  }
}
