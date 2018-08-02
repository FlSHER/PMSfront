import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { Flex, SearchBar, WingBlank, WhiteSpace } from 'antd-mobile';
import { EventType, EventName, SearchEvent } from '../../common/ListView/index.js';
import { Bread } from '../../components/General/index';
import { Nothing } from '../../components/index';
import { markTreeData } from '../../utils/util';
import nothing from '../../assets/nothing.png';

import style from './index.less';

@connect(({ event, loading, searchStaff, buckle }) => ({
  evtAll: event.evtAll,
  evtName: event.evtName,
  searchEvent: event.searchEvent,
  breadCrumb: event.breadCrumb,
  loadings: loading,
  loading: loading.effects['event/getEvent'],
  loadingName: loading.effects['event/getEventName'],
  // loadingSearch: loading.effects['event/searchEventName'],
  selectStaff: searchStaff.selectStaff,
  info: buckle.info,
  optAll: buckle.optAll,
}))
export default class SelEvent extends Component {
  state = {
    eventList: [],
    init: false,
    height: document.documentElement.clientHeight,
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
        breadCrumb: [{ name: '全部', id: -1 }],
      },
    });
  }

  componentDidMount() {
    const htmlDom = ReactDOM.findDOMNode(this.ptr);
    const offetTop = htmlDom.getBoundingClientRect().top;
    const hei = this.state.height - offetTop;
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

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onPageChange = () => {
    const { dispatch, searchEvent } = this.props;
    const { page } = searchEvent;
    const { searchValue } = this.state;
    dispatch({
      type: 'event/searchEventName',
      payload: {
        page: page + 1,
        pagesize: 20,
        filters: {
          name: {
            like: searchValue,
          },
        },
      },
    });
  }

  getSelectResult = (result) => {
    this.getSingleSelect(result);
  }
  getSingleSelect = (result) => {
    const { dispatch, history, match: { params } } = this.props;
    const { modal } = params;
    dispatch({
      type: `${modal}/saveEvent`,
      payload: {
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
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.searchSubmit(v);
    }, 500);
    this.setState({
      searchValue: v,
    });
    if (v === '') {
      this.searchCancel();
    }
  }
  searchSubmit = (v) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'event/searchEventName',
      payload: {
        page: 1,
        pagesize: 20,
        filters: {
          name: {
            like: v,
          },
        },
      },
    });
  }
  searchCancel = () => {
    const { breadCrumb, dispatch } = this.props;
    this.setState({
      searchValue: '',
    }, () => {
      if (breadCrumb && breadCrumb.length > 1) {
        this.selEventName(breadCrumb[breadCrumb.length - 1]);
      } else {
        dispatch({
          type: 'event/save',
          payload: {
            store: 'evtName',
            data: [],
          },
        });
      }
    });
  }

  render() {
    const { eventList, selected, searchValue } = this.state;
    const { breadCrumb, evtName, loading, loadings,
      loadingName, searchEvent, evtAll,
    } = this.props;
    const isLoading = loading || loadingName;
    const { page, totalpage, data = [] } = searchEvent;
    return (
      <Flex direction="column">
        <Flex.Item className={style.header} >
          <SearchBar
            value={searchValue}
            placeholder="请输入事件名称"
            onChange={this.searchChange}
            onSubmit={this.searchSubmit}
            onCancel={this.searchCancel}
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
          ref={(e) => { this.ptr = e; }}
          style={{ ...(isLoading && { display: 'none' }), overflow: 'auto', height: this.state.height }}
        >
          <WingBlank size="lg">

            {((searchValue && !data.length) ||
             (!evtName.length && !searchValue && !eventList.length)) &&
            (
              <div style={{ display: loadings.global ? 'none' : 'flex', flexDirection: 'column' }}>
                <Nothing src={nothing} />
              </div>
            )
          }
            {
            !searchValue && (
              <EventType
                name="name"
                heightNone
                dataSource={eventList || []}
                fetchDataSource={this.selEvent}
              />
            )
          }
            {eventList.length && evtName.length ? (
              <p style={{ padding: '0.5rem 0 0.2rem 0',
              background: 'rgb(245,245,245)',
              fontSize: '16px',
               color: 'rgb(100,100,100)' }}
              >事件列表
              </p>
          ) : null}
            {!searchValue ? (
              <React.Fragment>
                <EventName
                  name="name"
                  heightNone
                  selected={selected.data}
                  dataSource={evtName || []}
                  onChange={this.getSelectResult}
                />
                <WhiteSpace size="md" />
              </React.Fragment>)
              : null}
            {searchValue ? (
              <SearchEvent
                name="name"
                heightNone
                breadData={evtAll}
                selected={selected.data}
                dataSource={data || []}
                onChange={this.getSelectResult}
                page={page}
                totalpage={totalpage}
                onPageChange={this.onPageChange}
              />
          ) : null}
          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}
