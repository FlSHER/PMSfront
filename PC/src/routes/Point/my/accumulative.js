import React from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import Bar from './bar';
import OATable from '../../../components/OATable';
import Line from './line';
import styles from './index.less';


const columns = [{
  title: '月份/分值',
  dataIndex: 'month',
  width: 100,
  align: 'center',
  fixed: 'left',
}, {
  title: 'A分',
  align: 'center',
  dataIndex: 'source_a_total',
  children: [{
    title: '基础',
    dataIndex: 'source_a_total.0.point',
    align: 'center',
  }, {
    title: '工作',
    dataIndex: 'source_a_total.1.point',
    align: 'center',
  }, {
    title: '行政',
    dataIndex: 'source_a_total.2.point',
    align: 'center',
  }, {
    title: '创新',
    dataIndex: 'source_a_total.3.point',
    align: 'center',
  }, {
    title: '其他',
    dataIndex: 'source_a_total.4.point',
    align: 'center',
  }, {
    title: '总分',
    dataIndex: 'point_a_total',
    align: 'center',
  }],
}, {
  title: 'B分',
  dataIndex: 'source_b_total',
  children: [{
    title: '基础',
    dataIndex: 'source_b_total.0.point',
    align: 'center',
  }, {
    title: '工作',
    dataIndex: 'source_b_total.1.point',
    align: 'center',
  }, {
    title: '行政',
    dataIndex: 'source_b_total.2.point',
    align: 'center',
  }, {
    title: '创新',
    dataIndex: 'source_b_total.3.point',
    align: 'center',
  }, {
    title: '其他',
    dataIndex: 'source_b_total.4.point',
    align: 'center',
  }, {
    title: '总分',
    dataIndex: 'point_b_total',
    align: 'center',
  }],
}];

@connect(({ point, loading }) => ({
  accumulative: point.accumulative,
  source: point.type,
  loading: (
    loading.effects['point/fetchAccumulative'] ||
    loading.effects['point/fetchType']
  ),
}))
export default class extends React.PureComponent {
  componentWillMount() {
    this.fetch();
    this.props.dispatch({ type: 'point/fetchType' });
  }

  fetch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchAccumulative',
    });
  }

  makeSourcePoint = (total) => {
    const temp = {
      totalPoint: [],
    };
    const pointKey = { addPoint: 'add_point', minusPoint: 'sub_point', totalPoint: 'point' };
    total.forEach((item) => {
      const { name } = item;
      temp.totalPoint.push({
        name,
        key: item.id,
        value: item[pointKey.totalPoint],
      });
    });
    return temp;
  }

  makeAccumulativeTotal = () => {
    const { accumulative } = this.props;
    const total = accumulative.total || {};
    const { totalPoint } = this.makeSourcePoint(total.source_b_total || []);
    return totalPoint;
  }

  render() {
    const { loading, source, accumulative } = this.props;
    const total = accumulative.total || {};
    const hisotryTota = {
      month: [],
      aTotal: [],
      bTotal: [],
    };
    const dataSource = [];
    if (accumulative.list) {
      Object.keys(accumulative.list).forEach((key) => {
        const value = accumulative.list[key];
        dataSource.push({
          month: key,
          ...value,
        });
        hisotryTota.month.push(key);
        hisotryTota.aTotal.push(value.point_a_total);
        hisotryTota.bTotal.push(value.point_b_total);
      });
    }
    const accumulativeTotal = this.makeAccumulativeTotal();
    return (
      <Spin spinning={loading}>
        <div className={`${styles.accoum}`}>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.subItem} style={{ marginRight: 96 }}>
                <p>累计积分<span>{total.point_b_total}</span></p>
                <Bar source={source} data={accumulativeTotal} />
              </div>
              <div className={styles.subItem}>
                <p >积分变化趋势<span>&nbsp;</span></p>
                <Line data={hisotryTota} />
              </div>
            </div>
            <div className={styles.item}>
              <p style={{ textAlign: 'left' }}>
                历史累计积分
                <span style={{ fontSize: 36 }}>&nbsp;</span>
              </p>
              <OATable
                bordered
                size="small"
                operatorVisble={false}
                columns={columns}
                dataSource={dataSource}
                pagination={{ defaultPageSize: 12, hideOnSinglePage: true }}
              />
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

