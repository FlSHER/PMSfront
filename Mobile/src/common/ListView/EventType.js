import React, { Component } from 'react';
import { List } from 'antd-mobile';
import ListView from '../../components/ListView/event.js';
import style from './index.less';

const { Item } = List;
@ListView
export default class EventType extends Component {
  render() {
    const { value, fetchDataSource, name, onSelect } = this.props;
    if (value.children) {
      return (
        <Item
          arrow="horizontal"
          onClick={() => fetchDataSource(value)}
        >
          {value[name]}
        </Item>
      );
    }
    return (
      <div className={style.action_item}>
        <div
          onClick={() => onSelect(value)}
        >
          <span>{value[name]}</span>
        </div>
      </div>

    );
  }
}
EventType.defaultProps = {
  multiple: false,
};
