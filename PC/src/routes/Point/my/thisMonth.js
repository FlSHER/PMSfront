import React from 'react';
import { Icon, Spin } from 'antd';
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
  state = {
    month: thisMonth,
  }

  componentWillMount() {
    this.fetch();
    this.props.dispatch({ type: 'point/fetchType' });
  }

  fetch = () => {
    const { dispatch } = this.props;
    const { month } = this.state;
    dispatch({
      type: 'point/fetchMyPoint',
      payload: { datetime: month },
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
    const { month } = this.state;
    const { data } = this.props;
    const thisMonthPoint = data[month] || {};
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
    const nextArrow = classNames(styles.arrowRight, {
      [styles.disabled]: nextAbled,
    });
    const { monthly, sourceAMonthly, sourceBMonthly } = this.makePieDataSource();

    return (
      <Spin spinning={loading}>
        <div className={styles.viewContent}>
          <div className={styles.monthSelect}>
            <Icon
              type="left"
              className={styles.arrowLeft}
              onClick={() => this.handleArrowChange('prev')}
            />
            <span>{month}</span>
            <Icon
              type="right"
              className={nextArrow}
              onClick={() => {
                if (!nextAbled) this.handleArrowChange('next');
              }}
            />
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

