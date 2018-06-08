import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile';
import ListView from './ListView';

const { Item } = List;
class Department extends Component {
  render() {
    const { value, name, fetchDataSource } = this.props;
    return (
      <Item
        arrow="horizontal"
        onClick={fetchDataSource}
      >
        {value[name]}
      </Item>
    );
  }
}
const EnhanceDemo = ListView(Department);
export default connect(({ loading }) => ({ loading }))(EnhanceDemo);

