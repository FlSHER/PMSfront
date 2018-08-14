import React from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';

import Bar from './bar';
import OATable from '../../../components/OATable';
import Line from './line';
import styles from './index.less';


const columns = [{
  title: '月份/分值',
  dataIndex: 'name',
  key: 'name',
  width: 100,
  align: 'center',
  fixed: 'left',
}, {
  title: 'A分',
  align: 'center',
  children: [{
    title: '基础',
    dataIndex: 'age',
    align: 'center',
    key: 'age',
  }, {
    title: '工作',
    dataIndex: 'working',
    align: 'center',
    key: 'working',
  }, {
    title: '行政',
    dataIndex: 'xingzheng',
    align: 'center',
    key: 'xingzheng',
  }, {
    title: '创新',
    dataIndex: 'chuangxin',
    align: 'center',
    key: 'chuangxin',
  }, {
    title: '其他',
    dataIndex: 'qita',
    align: 'center',
    key: 'qita',
  }, {
    title: '总分',
    dataIndex: 'zongfen',
    align: 'center',
    key: 'zongfen',
  }],
}, {
  title: 'B分',
  children: [{
    title: '基础',
    dataIndex: 'bage',
    align: 'center',
    key: 'bage',
  }, {
    title: '工作',
    dataIndex: 'bworking',
    align: 'center',
    key: 'bworking',
  }, {
    title: '行政',
    dataIndex: 'bxingzheng',
    align: 'center',
    key: 'bxingzheng',
  }, {
    title: '创新',
    dataIndex: 'bchuangxin',
    align: 'center',
    key: 'bchuangxin',
  }, {
    title: '其他',
    dataIndex: 'bqita',
    align: 'center',
    key: 'bqita',
  }, {
    title: '总分',
    dataIndex: 'bzongfen',
    align: 'center',
    key: 'bzongfen',
  }],
}];

const data = [];
for (let i = 0; i < 12; i += 1) {
  data.push({
    key: i,
    name: '2018-08',
    street: 'Lake Park',
    building: 'C',
    age: 2035,
    working: 2035,
    bzongfen: 2035,
    gender: 'M',
  });
}


@connect(({ point, loading }) => ({
  data: point.me,
  source: point.source,
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

  render() {
    const { loading, source } = this.props;

    // const { monthly, sourceAMonthly, sourceBMonthly } = this.makePieDataSource();
    return (
      <Spin spinning={loading}>
        <div className={`${styles.accoum}`}>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.subItem} style={{ marginRight: 96 }}>
                <p>累计积分<span>5000</span></p>
                <Bar
                  data={[]}
                  source={source}
                />
              </div>
              <div className={styles.subItem}>
                <p >积分变化趋势<span>&nbsp;</span></p>
                <Line />
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
                dataSource={data}
                pagination={{ defaultPageSize: 12, hideOnSinglePage: true }}
              />
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

