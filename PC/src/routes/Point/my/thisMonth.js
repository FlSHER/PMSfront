import React from 'react';
import { Icon, Spin, Tooltip, Button } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import Bar from './bar';
import Pie from './pie';
import styles from './index.less';

const format = 'YYYY-MM';
const thisMonth = moment().format(format);

@connect(({ point, loading }) => ({
  data: point.me,
  source: point.type,
  loading: (
    loading.effects['point/fetchMyPoint'] ||
    loading.effects['point/fetchType']
  ),
}))
export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    const { datetime } = props;
    const month = datetime ? moment(datetime).format(format) : thisMonth;
    this.state = {
      month,
    };
  }

  componentWillMount() {
    this.fetch();
    this.props.dispatch({ type: 'point/fetchType' });
  }

  makeParams = () => {
    const { month } = this.state;
    const { staffSn } = this.props;
    const params = { datetime: month };
    if (staffSn) params.staff_sn = staffSn;
    return params;
  }

  fetch = (update) => {
    const { dispatch } = this.props;
    const params = this.makeParams();
    dispatch({
      type: 'point/fetchMyPoint',
      payload: params,
      update,
    });
  }


  handleArrowChange = (type) => {
    const { month } = this.state;
    let newMonth = moment().format(format);
    if (type === 'prev') {
      newMonth = moment(month).subtract(1, 'months').format(format);
    }
    if (type === 'next') {
      newMonth = moment(month).add(1, 'months').format(format);
    }
    this.setState({ month: newMonth }, this.fetch);
  }

  makeSourcePoint = (data) => {
    const temp = {
      addPoint: [],
      minusPoint: [],
      totalPoint: [],
      addPointTotal: 0,
      minusPintTotal: 0,
    };
    const pointKey = { addPoint: 'add_point', minusPoint: 'sub_point', totalPoint: 'point' };
    data.forEach((item) => {
      const { name } = item;
      const commo = {
        name: `key${item.id}`,
        text: name,
      };
      temp.addPoint.push({
        ...commo,
        value: item[pointKey.addPoint],
      });
      temp.minusPoint.push({
        ...commo,
        value: item[pointKey.minusPoint],
      });
      temp.totalPoint.push({
        name,
        key: item.id,
        value: item[pointKey.totalPoint],
      });
      temp.addPointTotal += item[pointKey.addPoint];
      temp.minusPintTotal += item[pointKey.minusPoint];
    });
    return temp;
  }

  makePieDataSource = () => {
    const result = this.props.data;
    const key = JSON.stringify(this.makeParams());
    const data = result[key] || {};
    const thisMonthPoint = data || {};
    const monthly = thisMonthPoint.monthly || {};
    const AMonthly = monthly.source_a_monthly || [];
    const BMonthly = monthly.source_b_monthly || [];
    const sourceAMonthly = this.makeSourcePoint(AMonthly);
    const sourceBMonthly = this.makeSourcePoint(BMonthly);
    return {
      monthly,
      sourceAMonthly,
      sourceBMonthly,
    };
  }

  render() {
    const { month } = this.state;
    const { loading, source } = this.props;
    const nextAbled = thisMonth === month;
    const preAbled = month === '2018-07';
    const nextArrow = classNames(styles.arrowRight, {
      [styles.disabled]: nextAbled,
    });
    const preArrow = classNames(styles.arrowLeft, {
      [styles.disabled]: preAbled,
    });
    const { monthly, sourceAMonthly, sourceBMonthly } = this.makePieDataSource();

    return (
      <Spin spinning={loading}>
        <div className={styles.viewContent}>
          <div className={styles.monthHeaher}>
            <Tooltip title="刷新数据" className={styles.tooltip}>
              <Button
                icon="sync"
                onClick={() => this.fetch(true)}
              />
            </Tooltip>
            <span className={styles.monthSelect}>
              <Icon
                type="left"
                className={preArrow}
                onClick={() => {
                  if (!preAbled) this.handleArrowChange('prev');
                }}
              />
              <span>{month}</span>
              <Icon
                type="right"
                className={nextArrow}
                onClick={() => {
                  if (!nextAbled) this.handleArrowChange('next');
                }}
              />
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.item}>
              <div className={styles.subItem}>
                <p>当月A分<span>{monthly.point_a_monthly || 0}</span></p>
                <Bar source={source} data={sourceAMonthly.totalPoint} />
              </div>
              <div className={styles.subItem}>
                <Pie
                  title="当月奖分"
                  source={source}
                  className={styles.top}
                  data={sourceAMonthly.addPoint}
                  total={sourceAMonthly.addPointTotal}
                />
                <Pie
                  title="当月扣分"
                  source={source}
                  data={sourceAMonthly.minusPoint}
                  total={sourceAMonthly.minusPintTotal}
                />
              </div>
            </div>
            <div style={{ minWidth: 51, flexGrow: 1 }} />
            <div className={styles.item}>

              <div className={styles.subItem}>
                <p>当月B分<span>{monthly.point_b_monthly || 0}</span></p>
                <Bar source={source} data={sourceBMonthly.totalPoint} />
              </div>
              <div className={styles.subItem}>
                <Pie
                  title="当月奖分"
                  source={source}
                  className={styles.top}
                  data={sourceBMonthly.addPoint}
                  total={sourceBMonthly.addPointTotal}
                />
                <Pie
                  title="当月扣分"
                  source={source}
                  data={sourceBMonthly.minusPoint}
                  total={sourceBMonthly.minusPintTotal}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

