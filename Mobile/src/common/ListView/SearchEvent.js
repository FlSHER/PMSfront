import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class SearchEvent extends Component {
  render() {
    const { value, onClick, checked, multiple } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : { className: style.single_item };
    return (
      <div
        className={style.action_item}
        onClick={() => onClick(value)}
      >
        <div
          {...className}
        >
          <span>{value.name}</span>
        </div>
        <div className={style.department_title}>
          <span>初审人:{value.first_approver_name}</span>
          <span style={{ marginLeft: '10px' }}>终审人:{value.final_approver_name}</span>
        </div>
      </div>
    );
  }
}
SearchEvent.defaultProps = {
  multiple: false,
};
