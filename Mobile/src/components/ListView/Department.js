import React, { Component } from 'react';
import { connect } from 'dva';
import { List } from 'antd-mobile'
import ListView from './ListView'

const Item = List.Item;
class Department extends Component {
  UNSAFE_componentWillMount() {

  }

  
  render() {
    const { value, name,fetchDataSource } = this.props
    console.log('item', value)
    return (
      <Item arrow="horizontal"
        onClick={fetchDataSource}
      >
        {value[name]}
      </Item>
    );
  }
}
const EnhanceDemo = ListView(Department);
export default connect(({ loading }) => ({ loading }))(EnhanceDemo);


