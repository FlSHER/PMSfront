import React, { Component } from 'react';
import { List } from 'antd-mobile';
import ListView from './ListView';

const { Item } = List;
@ListView
export default class Department extends Component {
  render() {
    const { value, fetchDataSource } = this.props;
    return (
      <Item
        arrow="horizontal"
        onClick={() => fetchDataSource(value)}
      >
        {value.name}
      </Item>
    );
  }
}
