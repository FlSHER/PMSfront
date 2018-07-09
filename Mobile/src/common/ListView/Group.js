import React, { Component } from 'react';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ListView from '../../components/ListView';

@ListView
@connect()
export default class Group extends Component {
  redirect=() => {
    const { datetime, value, dispatch } = this.props;
    dispatch(routerRedux.push(`/ranking?group_id=${value.id}&datetime=${datetime}`));
  }
  render() {
    const { value } = this.props;
    return (
      <List.Item
        arrow="horizontal"
        onClick={() => this.redirect()}
      >{value.name}
      </List.Item>
    );
  }
}

