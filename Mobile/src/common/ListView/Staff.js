import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class Staff extends Component {
  render() {
    const { value, onClick, checked, multiple, name = 'realname', isFinal = false } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : null;
    return (
      <div
        className={style.action_item}
        onClick={() => onClick(value)}
      >
        <div
          {...className}
        >
          <span>{value[name]}</span>
        </div>
        {isFinal ? (
          <div className={style.brief}>
            <span>A分：{(value.point_a_deducting_limit ? `-${value.point_a_deducting_limit}` : '0') } — {value.point_a_awarding_limit}</span>
            <span style={{ marginLeft: '1.3333rem' }}>B分：{(value.point_b_deducting_limit ? `-${value.point_b_deducting_limit}` : '0')} — {value.point_b_awarding_limit}</span>
          </div>
) : null}

      </div>
    );
  }
}
Staff.defaultProps = {
  multiple: false,
};
