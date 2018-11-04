import React from 'react';
import echarts from 'echarts';
import moment from 'moment';
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
  show: true,
  lineStyle: {
    color: '#969696',
  },
};
const colors = ['#cf4252', '#59c3c3'];
const option = {
  color: colors,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['A分', 'B分'],
    zoomLock: 20,
    top: 0,
    right: 10,
  },
  grid: {
    top: 30,
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
      show: true,
    },
    data: ['2018-1', '2018-2', '2018-3', '2018-4', '2018-5', '2018-6', '2018-7', '2018-8', '2018-9', '2018-10', '2018-11', '2018-12'],
  },
  yAxis: {
    type: 'value',
    splitArea: false,
    splitLine,
    axisTick,
    axisLine,
  },
  dataZoom: [{
    type: 'inside',
    zoomLock: true,
    start: 0,
    end: 90,
  }],
  series: [
    {
      type: 'bar',
      name: 'A分',
      barMaxWidth: 20,
      barGap: '30%', // Make series be overlap·
      data: [],
    },
    {
      type: 'bar',
      name: 'B分',
      barMaxWidth: 20,
      data: [],
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
    this.setState({ myChart: echarts.init(this.bar) });
  }

  render() {
    const { data, width, height, style } = this.props;
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
      newInitOption.xAxis.data = xAxisData;
      newInitOption.series[0].data = aTotal;
      newInitOption.series[1].data = bTotal;
      myChart.setOption(newInitOption);
    }
    return (
      <div className={styles.graphContent} style={style}>
        <div
          className={styles.graph}
          ref={(e) => { this.bar = e; }}
          style={{ width: width || 270, height: height || 260 }}
        />
      </div>
    );
  }
}
