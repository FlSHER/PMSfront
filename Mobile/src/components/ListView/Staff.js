import React, { Component } from 'react';
import ListView from './ListView';
import style from './index.less';

@ListView
export default class Staff extends Component {
  render() {
    const { value, onClick, checked, multiple } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : null;
    return (
      <div className={style.action_item}>
        <div
          {...className}
          onClick={() => onClick(value)}
        >
          <span>{value.realname}</span>
        </div>
      </div>
    );
  }
}
Staff.defaultProps = {
  multiple: false,
};
