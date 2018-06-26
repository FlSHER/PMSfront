import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { EventType, EventName } from '../../common/ListView/index.js';
import { Bread } from '../../components/General/index';
import { markTreeData } from '../../utils/util';
import styles from '../common.less';

@connect(({ event, loading }) => ({
  evtAll: event.evtAll,
  evtName: event.evtName,
  breadCrumb: event.breadCrumb,
  loading: loading.effects['event/getEvent'],
}))
export default class SelEvent extends Component {
  state={
    eventList: [],
    init: false,
    type: '1',
    selected: {
      data: [],
      total: 50,
      num: 0,
    },
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
  getSelectResult = (result) => {
    const { selected, type } = this.state;
    if (type === '1') {
      this.getSingleSelect(result);
    } else {
      this.setState({
        selected: {
          ...selected,
          data: result,
          num: result.length,
        },
      });
    }
  }
  getSingleSelect = (result) => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'event/saveSelectEvent',
      payload: {
        key: 'evtName',
        value: result,
      },
    });
    history.goBack(-1);
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
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'event/save',
    //   payload: {
    //     store: 'evtAll',
    //     data: [],
    //   },
    // });
    dispatch({
      type: 'event/getEventName',
      payload: {
        id: item.id,
      },
    });
  }
  selEvent = (item) => {
    const { dispatch, evtAll } = this.props;
    if (item.id === -1) {
      const tree = markTreeData(evtAll, null, { parentId: 'parent_id', key: 'id' });
      this.setState({
        eventList: tree,
      }, () => {
        dispatch({
          type: 'event/save',
          payload: {
            store: 'breadCrumb',
            data: [{ name: '选择事件', id: -1 }],
          },
        });
      });
    } else {
      const newEventList = item.children;
      const breadCrumb = this.makeBreadCrumbData(item);
      this.setState({
        eventList: newEventList || [],
      }, () => {
        dispatch({
          type: 'event/save',
          payload: {
            store: 'breadCrumb',
            data: breadCrumb,
          },
        });
      });
      if (!newEventList) {
        this.selEventName(item);
      }
    }
  }


  render() {
    const { eventList, type, selected } = this.state;
    const { breadCrumb, evtName } = this.props;
    return (
      <div className={styles.con}>
        <Bread
          bread={breadCrumb}
          handleBread={this.selEvent}
        />
        <EventType
          dataSource={eventList || []}
          fetchDataSource={this.selEvent}
          name="name"
        />
        <EventName
          link=""
          name="name"
          dispatch={this.props.dispatch}
          multiple={type !== '1'}
          selected={selected.data}
          dataSource={evtName || []}
          onChange={this.getSelectResult}
        />
      </div>
    );
  }
}
