import React, { Component } from 'react';
// import { List } from 'antd-mobile';
import ListView from '../../routes/Point/ListView';
import style from './index.less';
// const { Item } = List;
@ListView
export default class Point extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <div className={style.event_item}>
        <div className={style.main_info} onClick={onClick}>
          <div className={style.event_title}>
            <span>事件标题</span>
          </div>
          <div className={style.time}>积分生效时间</div>
          <div className={style.desc}>
        今天天气好晴朗，处处好风光。可是就是有时冷，有时热，温度变化多端，让人感到烦恼
          </div>
        </div>
      </div>
    );
  }
}
