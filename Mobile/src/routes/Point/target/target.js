import React from 'react';
import {
  connect,
} from 'dva';
import moment from 'moment';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import MonthPicker from '../../../components/General/MonthPicker';
import { userStorage } from '../../../utils/util';

import style from '../index.less';

const targetInfo = [
  {
    label: '当月奖分',
    key: 'point_b_awarding_result',
  },
  {
    label: '当月扣分',
    key: 'point_b_deducting_result',
  },
  {
    label: '当月人次',
    key: 'event_count_result',
  },
  {
    label: '当月奖扣比例',
    key: 'deducting_percentage_result',
    extra: '%',
  },
];

const targetTask = [
  {
    label: '奖分任务',
    key: 'point_b_awarding_target',
  },
  {
    label: '扣分任务',
    key: 'point_b_deducting_target',
  },
  {
    label: '人次任务',
    key: 'event_count_target',
  },
  {
    label: '比例任务',
    key: 'deducting_percentage_target',
    extra: '%',
  },
];

@connect(({ target }) => ({
  target: target.target,
}))
export default class Statistic extends React.Component {
  componentWillMount() {
    this.datetime = moment(new Date()).format('YYYY-MM');
    this.getTarget({ datetime: this.datetime });
    this.userInfo = userStorage('userInfo');
  }

  getTarget = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'target/getTarget',
      payload: { ...params },
    });
  }

  monthChange = (v) => {
    this.datetime = v;
    this.getTarget({ datetime: v });
  }

  makeTargetInfo = (dataSource, target) => {
    const newTarget = target || {};
    const newInfo = dataSource.map((item) => {
      const obj = { ...item };
      obj.value = (newTarget[item.key] ? newTarget[item.key] : 0) + (item.extra ? item.extra : '');
      return obj;
    });
    return newInfo;
  }

  renderTargetInfo = (info) => {
    return info.map(item => (
      <div
        key={item.key}
        className={style.item}
      >
        <div>
          {item.label}
        </div>
        <div style={{ marginTop: '8px' }}>
          {item.value}
        </div>
      </div>
    ));
  }

  renderTaskInfo = (info) => {
    return info.map(item => (
      <div key={item.key}>{item.label}：{item.value}</div>)
    );
  }
  render() {
    const { userInfo, datetime } = this;
    const { target } = this.props;
    const nowDate = moment(new Date()).format('YYYY-MM');
    const isNowMonth = nowDate === datetime;
    const newInfo = this.makeTargetInfo(targetInfo, target);
    const newTask = this.makeTargetInfo(targetTask, target.target);
    return (
      <Flex direction="column">
        <Flex.Item
          className={style.content}
        >
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.header_info}>
              <div className={style.ranking_user_info}>
                <PersonIcon
                  value={userInfo}
                  footer={false}
                  nameKey="realname"
                  itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
                />
                <div>
                  <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
                  <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{userInfo.department && userInfo.department.full_name}/{userInfo.brand && userInfo.brand.name}</p>
                </div>
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.players}>
              <Flex className={style.time_sel}>
                <MonthPicker
                  onChange={this.monthChange}
                />
              </Flex>
            </div>
            <div className={style.players} style={{ padding: '0.4rem' }}>
              <Flex align="start" className={style.data_item}>
                <div className={style.aside}>
                  <div className={style.aside_title}>{isNowMonth ? '预计扣分' : '实际扣分'}</div>
                  <div className={style.get_point}>{222}</div>
                </div>
                <div className={style.point_type}>
                  {this.renderTaskInfo(newTask)}
                </div>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.players} style={{ padding: '0.4rem' }}>
              <div className={style.target}>
                {this.renderTargetInfo(newInfo)}
              </div>
            </div>
          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}
