import React from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import Bar from './bar';
import HistoryBar from './historyBar';
import OATable from '../../../components/OATable';
import Line from './line';
import styles from './index.less';


const columns = [{
  title: '月份',
  dataIndex: 'month',
  width: 100,
  align: 'center',
}, {
  title: 'A分',
  align: 'center',
  children: [{
    title: '基础',
    width: 50,
    dataIndex: 'source_a_total.0.point',
    align: 'center',
  }, {
    title: '工作',
    width: 50,
    dataIndex: 'source_a_total.1.point',
    align: 'center',
  }, {
    title: '行政',
    width: 50,
    dataIndex: 'source_a_total.2.point',
    align: 'center',
  }, {
    title: '创新',
    width: 50,
    dataIndex: 'source_a_total.3.point',
    align: 'center',
  }, {
    title: '其他',
    width: 50,
    dataIndex: 'source_a_total.4.point',
    align: 'center',
  }, {
    title: '总分',
    width: 50,
    dataIndex: 'point_a_total',
    align: 'center',
  }],
}, {
  title: 'B分',
  children: [{
    title: '基础',
    width: 50,
    dataIndex: 'source_b_total.0.point',
    align: 'center',
  }, {
    title: '工作',
    width: 50,
    dataIndex: 'source_b_total.1.point',
    align: 'center',
  }, {
    title: '行政',
    width: 50,
    dataIndex: 'source_b_total.2.point',
    align: 'center',
  }, {
    title: '创新',
    width: 50,
    dataIndex: 'source_b_total.3.point',
    align: 'center',
  }, {
    title: '其他',
    width: 50,
    dataIndex: 'source_b_total.4.point',
    align: 'center',
  }, {
    title: '总分',
    width: 50,
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

  makeParams = () => {
    const { staffSn } = this.props;
    const params = {};
    if (staffSn) params.staff_sn = staffSn;
    return params;
  }

  fetch = () => {
    const { dispatch } = this.props;
    const params = this.makeParams();
    dispatch({ type: 'point/fetchAccumulative', payload: params });
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

  makeResult = () => {
    const result = this.props.accumulative;
    const key = JSON.stringify(this.makeParams());
    const accumulative = result[key] || {};
    return { accumulative };
  }

  makeAccumulativeTotal = () => {
    const { accumulative } = this.makeResult();
    const total = accumulative.total || {};
    const { totalPoint } = this.makeSourcePoint(total.source_b_total || []);
    return totalPoint;
  }

  render() {
    const { loading, source } = this.props;
    const { accumulative } = this.makeResult();
    const total = accumulative.total || {};
    const hisotryTotal = {
      month: [],
      aTotal: [],
      bTotal: [],
    };
    const addUp = {
      month: [],
      // aTotal: [],
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
        hisotryTotal.month.push(key);
        hisotryTotal.aTotal.push(value.point_a);
        hisotryTotal.bTotal.push(value.point_b_monthly);

        addUp.month.push(key);
        // hisotryTotal.aTotal.push(value.point_a);
        addUp.bTotal.push(value.point_b_total);
      });
    }
    const accumulativeTotal = this.makeAccumulativeTotal();
    return (
      <Spin spinning={loading}>
        <div className={`${styles.accoum}`}>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.subItem} >
                <p>累计积分<span>{total.point_b_total}</span></p>
                <Bar source={source} data={accumulativeTotal} width={500} />
              </div>
              <div className={styles.subItem} >
                <Line data={addUp} width={500} />
              </div>
            </div>
            <div className={styles.item}>
              <p style={{ textAlign: 'left' }}>
                历史积分
                <span style={{ fontSize: 36 }}>&nbsp;</span>
              </p>
              <HistoryBar
                data={hisotryTotal}
                width={500}
                style={{ marginBottom: 40 }}
              />
              <div >
                <OATable
                  bordered
                  size="small"
                  operatorVisble={false}
                  columns={columns}
                  dataSource={dataSource}
                  scroll={{ y: 450 }}
                  pagination={{ defaultPageSize: 12, hideOnSinglePage: true }}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

