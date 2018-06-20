import React, { Component } from 'react';
import ListView from '../../components/ListView/event.js';
import style from './index.less';

@ListView
export default class EventList extends Component {
  render() {
    const { value, onChange, checked, multiple, name } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : null;
    return (
      <div className={style.action_item}>
        <div
          {...className}
          onClick={() => onChange(value)}
        >
          <span>{value[name]}</span>
        </div>
      </div>
    );
  }
}
EventList.defaultProps = {
  multiple: false,
};
