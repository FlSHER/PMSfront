import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { EventType } from '../../common/ListView/index.js';
import { markTreeData } from '../../utils/util';
import styles from '../common.less';

@connect(({ example, event, loading }) => ({
  example,
  evtAll: event.evtAll,
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
  selEventName= (item) => {
    this.props.dispatch({
      type: 'event/saveSelectEvent',
      payload: {
        key: 'event',
        value: item,
      },
    });
    this.props.history.goBack(-1);
  }
  selEvent = (item) => {
    const newEventList = item.children;
    this.setState({
      eventList: newEventList,
    });
  }
  render() {
    const { eventList } = this.state;
    return (
      <div className={styles.con}>
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
