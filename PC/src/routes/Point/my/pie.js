import React from 'react';
import echarts from 'echarts';
import styles from './index.less';

const color = ['#66cbff', '#b4e682', '#fff04c', '#ffb266', '#ff7f94'];
export const xAxisData = ['固定', '系统', '奖扣', '其他', '基础'];

const option = {
  color,
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    x: 'left',
    selectedMode: false,
    data: xAxisData,
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      hoverAnimation: false,
      label: {
        position: 'outside',
        normal: {
          show: true,
          position: 'center',
        },
        emphasis: {
          show: false,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        show: true,
      },
      data: [
        { value: 335, name: '' },
        { value: 310, name: '' },
        { value: 234, name: '' },
        { value: 135, name: '' },
        { value: 1548, name: '' },
      ],
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
          style={{ width: 270, height: 260 }}
        />
      </div>
    );
  }
}

