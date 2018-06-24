import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { EventType } from '../../common/ListView/index.js';
import { Bread } from '../../components/General/index';
import { markTreeData } from '../../utils/util';
import styles from '../common.less';

@connect(({ event, loading }) => ({
  evtAll: event.evtAll,
  breadCrumb: event.breadCrumb,
  loading: loading.effects['event/getEvent'],
}))
export default class SelEvent extends Component {
  state={
    eventList: [],
    init: false,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'event/getEvent',
      payload: {
        breadCrumb: [{ name: '选择事件', id: -1 }],
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const { evtAll } = nextProps;
    if (evtAll && evtAll.length && !this.state.init) {
      const tree = markTreeData(evtAll, null, { parentId: 'parent_id', key: 'id' });
      this.setState({
        init: true,
        eventList: tree,
      });
    }
  }
  makeBreadCrumbData = (params) => {
    const { breadCrumb } = this.props;
    let newBread = [...breadCrumb];
    let splitIndex = null;
    newBread.forEach((item, index) => {
      if (item.id === params.id) {
        splitIndex = index + 1;
      }
    });
    if (splitIndex !== null) {
      newBread = newBread.slice(0, splitIndex);
    } else {
      newBread.push(params);
    }
    return newBread;
  }
  selEventName= (item) => {
    this.props.dispatch({
      type: 'event/saveData',
      payload: {
        key: 'event',
        value: item,
      },
    });
    this.props.history.goBack(-1);
  }
  selEvent = (item) => {
    const { dispatch, evtAll } = this.props;
    if (item.id === -1) {
      const tree = markTreeData(evtAll, null, { parentId: 'parent_id', key: 'id' });
      this.setState({
        eventList: tree,
      }, () => {
        dispatch({
          type: 'event/saveData',
          payload: {
            key: 'breadCrumb',
            value: [{ name: '选择事件', id: -1 }],
          },
        });
      });
    } else {
      const newEventList = item.children;
      const breadCrumb = this.makeBreadCrumbData(item);
      this.setState({
        eventList: newEventList,
      }, () => {
        dispatch({
          type: 'event/saveData',
          payload: {
            key: 'breadCrumb',
            value: breadCrumb,
          },
        });
      });
    }
  }
  render() {
    const { eventList } = this.state;
    const { breadCrumb } = this.props;
    return (
      <div className={styles.con}>
        <Bread
          bread={breadCrumb}
          handleBread={this.selEvent}
        />
        <EventType
          dataSource={eventList || []}
          fetchDataSource={this.selEvent}
          onSelect={this.selEventName}
          name="name"
        />
      </div>
    );
  }
}
