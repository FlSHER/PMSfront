import React, { Component } from 'react';
import ListView from '../../components/ListView';


import style from './index.less';


@ListView
export default class Buckle extends Component {
  render() {
    const {
      handleClick,
      hasShortcut = false,
      value,
      label,
      extra,
    } = this.props;

    return (
      <div className={style.event_item}>
        <div
          className={style.main_info}
          style={{ marginRight: hasShortcut ? '0.53333333rem' : '0' }}
          onClick={() => handleClick(value)}
        >
          <div className={style.event_title}>
            <span className={style.event_name}>{value.title}</span>
            {label.map((its, i) => {
              const idx = i;
              return (
                <div
                  key={idx}
                  className={style[its.labelStyle(value)]}
                >
                  {its.evt(value)}
                </div>
              );
            })}
          </div>
          <div className={style.time}>
            {value.remark}
          </div>
          <div className={style.desc}>
            记录人：{value.recorder_name}
          </div>
          <div className={style.desc}>{value.created_at}</div>
        </div>
        {extra && extra(value)}
      </div>
    );
  }
}
