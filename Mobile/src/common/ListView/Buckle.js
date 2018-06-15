import React, { Component } from 'react';
// import { List } from 'antd-mobile';
import ListView from '../../routes/Buckle/ListView';
import shortcut from '../../assets/shortcuts.png';
import style from './index.less';
// const { Item } = List;
@ListView
export default class Department extends Component {
  render() {
    const { onClick, onShortcut } = this.props;
    return (
      <div className={style.event_item}>
        <div className={style.main_info} onClick={onClick}>
          <div className={style.event_title}>
            <span>事件标题</span>
            <div className={style.label_state_2}>终审</div>
          </div>
          <div className={style.time}>2018.6.11</div>
          <div className={style.desc}>
        今天天气好晴朗，处处好风光。可是就是有时冷，有时热，温度变化多端，让人感到烦恼
          </div>
        </div>
        <div className={style.aside}>
          <img
            src={shortcut}
            alt="快捷操作"
            onClick={onShortcut}
          />
        </div>
      </div>
    );
  }
}
