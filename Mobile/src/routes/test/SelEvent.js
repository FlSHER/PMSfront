import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { Flex } from 'antd-mobile';
import { EventType, EventName } from '../../common/ListView/index.js';
import { Bread, Search } from '../../components/General/index';
import { Nothing } from '../../components/index';
import { markTreeData, userStorage } from '../../utils/util';
import nothing from '../../assets/nothing.png';

import style from './index.less';

@connect(({ event, loading, searchStaff, buckle }) => ({
  evtAll: event.evtAll,
  evtName: event.evtName,
  breadCrumb: event.breadCrumb,
  loading: loading.effects['event/getEvent'],
  loadingName: loading.effects['event/getEventName'],
  selectStaff: searchStaff.selectStaff,
  info: buckle.info,
  optAll: buckle.optAll,
  pageInfo: event.pageInfo,
}))
export default class SelEvent extends Component {
  state = {
    height: document.documentElement.clientHeight,
    eventList: [],
    init: false,
    type: '1',
    selected: {
      data: [],
      total: 50,
      num: 0,
    },
    searchValue: '',
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'event/getEvent',
      payload: {
        breadCrumb: [{ name: '选择事件', id: -1 }],
      },
    });
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
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
  onPageChange = () => {
    const { dispatch, pageInfo } = this.props;
    const { searchValue } = this.state;
    dispatch({
      type: 'event/searchEventName',
      payload: {
        page: pageInfo.page + 1,
        pagesize: 15,
        filters: {
          name: {
            like: searchValue,
          },
        },
      },
    });
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
    const userInfo = userStorage('userInfo');
    const { history, dispatch, selectStaff, info, optAll } = this.props;
    const newSelectStaff = { ...selectStaff };
    const newInfo = { ...info };

    const participants = (info.participants || []).map((item) => {
      const obj = { ...item };
      obj.point_a = result.point_a_default;
      obj.point_b = result.point_b_default;
      return obj;
    });
    newInfo.participants = [...participants];
    dispatch({
      type: 'buckle/save',
      payload: {
        store: 'info',
        data: newInfo,
      },
    });
    dispatch({
      type: 'buckle/save',
      payload: {
        store: 'optAll',
        data: {
          ...optAll,
          pointA: result.point_a_default,
          pointB: result.point_b_default,
        },
      },
    });
    newSelectStaff.first = [
      {
        staff_sn: result.first_approver_sn || userInfo.staff_sn,
        realname: result.first_approver_name || userInfo.realname,
      },
    ];
    if (result.final_approver_sn) {
      newSelectStaff.final = [
        {
          staff_sn: result.final_approver_sn,
          realname: result.final_approver_name,
        },
      ];
    }
    const addressees = [...(result.default_cc_addressees || [])];
    const newAddress = addressees.map((its) => {
      const obj = { ...its };
      obj.realname = its.staff_name;
      obj.lock = 1;
      return obj;
    });
    newSelectStaff.copy = [...newAddress];
    dispatch({
      type: 'event/save',
      payload: {
        store: 'event',
        data: result,
      },
    });
    dispatch({
      type: 'searchStaff/save',
      payload: {
        store: 'selectStaff',
        data: newSelectStaff,
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
  selEventName = (item) => {
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
    dispatch({
      type: 'event/save',
      payload: {
        store: 'evtName',
        data: [],
      },
    });
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
      // if (!newEventList) {
      this.selEventName(item);
      // }
    }
  }
  searchChange = (v) => {
    this.setState({
      searchValue: v,
    });
  }
  searchSubmit = (v) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'event/searchEventName',
      payload: {
        page: 1,
        pagesize: 15,
        filters: {
          name: {
            like: v,
          },
        },
      },
    });
  }
  render() {
    const { eventList, type, selected, searchValue } = this.state;
    const { breadCrumb, evtName, loading, loadingName, pageInfo } = this.props;
    const isLoading = loading || loadingName;
    return (
      <Flex direction="column" style={{ ...(isLoading ? { display: 'none' } : null) }}>
        <Flex.Item className={style.header}>
          <Search
            value={searchValue}
            onChange={this.searchChange}
            onSubmit={this.searchSubmit}
          />
          {!searchValue ? (
            <Bread
              bread={breadCrumb}
              handleBread={this.selEvent}
            />
          ) : null}

        </Flex.Item>
        <Flex.Item
          className={style.content}
          ref={(el) => { this.ptr = el; }}
        >
          {(!eventList.length && !evtName.length) ?
          (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
              <Nothing src={nothing} />
            </div>
          ) : (
            <div
              style={{ height: this.state.height }}
            >
              {!searchValue ? (
                <EventType
                  dataSource={eventList || []}
                  fetchDataSource={this.selEvent}
                  name="name"
                />) : null}
              {eventList.length && evtName.length ?
                <p style={{ padding: '0.5rem 0 0.2rem 0.4rem', fontSize: '16px', color: 'rgb(100,100,100)' }}>事件列表</p> : null}
              <EventName
                name="name"
                dispatch={this.props.dispatch}
                multiple={type !== '1'}
                selected={selected.data}
                dataSource={evtName || []}
                onChange={this.getSelectResult}

                page={pageInfo.page}
                totalpage={pageInfo.totalpage}
                onPageChange={this.onPageChange}
              />
            </div>)
              }
        </Flex.Item>
      </Flex>
    );
  }
}
