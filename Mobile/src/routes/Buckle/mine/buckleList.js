import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { Buckle } from '../../../common/ListView/index';
import {
  convertStyle,
  auditFinishedState,
  buckleState,
  auditFinishedLabel,
} from '../../../utils/convert.js';
import { userStorage } from '../../../utils/util';

import { ListFilter, CheckBoxs, ListSort, StateTabs, Nothing } from '../../../components/index';
import style from '../index.less';

const sortList = [
  { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
];
const auditStates = [
  { name: '我参与的', value: 'participant' },
  { name: '我记录的', value: 'recorded' },
  { name: '抄送我的', value: 'addressee' },
  { name: '我审核的', value: 'approved' },
];

const dealtOption = [
  { name: '已通过', value: 1 },
  { name: '已驳回', value: -1 },
];
const stateOption = [
  { name: '已通过', value: 2 },
  { name: '已驳回', value: -1 },
  { name: '审核中', value: 0 },
  { name: '已撤回', value: -2 },
];
const procesingOption = [
  { name: '初审', value: 'first_approver_sn' },
  { name: '终审', value: 'final_approver_sn' },
];
@connect(({ buckle }) => ({
  logList: buckle.logList,
}))
export default class BuckleList extends React.Component {
  state = {
    filter: {// 筛选结果
      approveType: [],
      eventState: '',
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
    checkState: { name: '我参与的', value: 'participant' },
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const newInfo = userStorage('userInfo');
    this.setState({
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'buckle/getLogsList',
        payload: {
          pagesize: 10,
          type: 'participant',
          page: 1,
        },
      });
    });
  }
  onPageChange = () => {
    const { dispatch, logList } = this.props;
    const { checkState, sortItem } = this.state;
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        sort: sortItem.value,
        page: logList[checkState.value].page + 1,
        filters: this.dealFilter(),
      },
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  onRefresh = () => {
    const { dispatch } = this.props;
    const { checkState, sortItem } = this.state;
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        page: 1,
        sort: sortItem.value,
        type: checkState.value,
        filters: this.dealFilter(),
      },
    });
  }
  onCancel = (e, feild) => {
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = false;
    this.setNewState('modal', newModal);
  }
  onResetForm = () => {
    const { checkState, sortItem } = this.state;
    const { dispatch } = this.props;
    this.setState(
      { filter: {// 筛选结果
        approveType: [],
        eventState: '',
      } }, () => {
        dispatch({
          type: 'buckle/getLogsList',
          payload: {
            pagesize: 10,
            type: checkState.value,
            page: 1,
            sort: sortItem.value,
          },
        });
      });
  }
  onFilterOk = () => {
    const { checkState, sortItem } = this.state;
    const { dispatch } = this.props;
    // const search = {
    //   created_at: {
    //     min: `${filter.time.year}-${filter.time.month.min}-01`,
    //     max: `${filter.time.year}-${filter.time.month.max}-01`,
    //   },
    // };
    // search[filter.point] = {
    //   min: filter.range.min,
    //   max: filter.range.max,
    // };
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        page: 1,
        sort: sortItem.value,
        filters: this.dealFilter(),
      },
    });
    this.onCancel('', 'filterModal');
  }
  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }

  dealFilter = () => {
    const { filter, checkState, userInfo } = this.state;
    const { approveType, eventState } = filter;
    const search = {};

    if (checkState.value === 'approved') { // 审核列表
      if (!(approveType.length === procesingOption.length)
      && approveType.length) { // 如果type为审核中不是全选
        const appType = approveType[0];
        search[appType] = userInfo.staff_sn;
        if (appType === 'first_approver_sn') {
          search.status_id = eventState === 1 ? 1 : eventState;
        }
        if (appType === 'final_approver_sn') {
          search.status_id = eventState === 1 ? 2 : eventState;
        }
      }
    } else {
      search.status_id = eventState === 0 ? { in: [0, 1] } : eventState;
    }
    return search;
  }
  sortReasult = (item) => {
    const { dispatch } = this.props;
    const { modal, checkState } = this.state;
    const newModal = { ...modal };
    newModal.sortModal = false;
    this.setState({
      modal: { ...newModal },
      sortItem: item,
    }, () => {
      dispatch({
        type: 'buckle/getLogsList',
        payload: {
          pagesize: 10,
          type: checkState.value,
          page: 1,
          sort: item.value,
        },
      });
    });
  }
  showModal = (e, key) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  selFilter = (feild) => { // 筛选
    const { modal } = this.state;
    const modalObj = {};
    Object.keys(modal).map((key) => {
      const value = modal[key];
      if (key !== feild) {
        modalObj[key] = false;
      } else {
        modalObj[key] = !value;
      }
      return value;
    });
    this.setNewState('modal', modalObj);
  }

  checkItem = (i, v, key) => {
    const { filter } = this.state;
    const newFilter = { ...filter };
    const temp = newFilter[key] === v ? '' : v;
    newFilter[key] = temp;
    this.setNewState('filter', newFilter);
  }
  doMultiple = (i, v, key) => {
    const { filter } = this.state;
    const newFilter = { ...filter };
    let temp = [...(newFilter[key] || [])];
    const isExist = temp.indexOf(v) !== -1;
    if (isExist) {
      temp = temp.filter(item => item !== v);
    } else {
      temp.push(v);
    }
    newFilter[key] = [...temp];
    this.setNewState('filter', newFilter);
  }
  tabChange = (item) => {
    const { dispatch, logList } = this.props;
    this.setState({
      checkState: item,
    }, () => {
      if (logList[item.value]) {
        return;
      }
      dispatch({
        type: 'buckle/getLogsList',
        payload: {
          pagesize: 10,
          type: item.value,
          page: 1,
        },
      });
    });
  }
  toLookDetail = (item) => {
    this.props.history.push(`/audit_detail/${item.id}`);
  }
  rangeChange = (v, key) => {
    const { filter } = this.state;
    const { range } = filter;
    const newRange = { ...range };
    newRange[key] = v;
    this.setState({
      filter: {
        ...filter,
        range: newRange,
      },
    });
  }
  yearChange = (v, key) => {
    const { filter } = this.state;
    const { time } = filter;
    const newTime = { ...time };
    newTime[key] = v;
    this.setState({
      filter: {
        ...filter,
        time: newTime,
      },
    });
  }
  monthChange = (v, key) => {
    let newV = Number(v);
    const { filter } = this.state;
    const { time } = filter;
    const newRange = { ...time };
    const { month } = time;
    if (newV > 12) {
      return;
    }
    if (newV === 0) {
      newV = 1;
    }
    month[key] = newV;
    newRange.month = { ...month };
    this.setState({
      filter: {
        ...filter,
        time: newRange,
      },
    });
  }
  renderLalbel = () => {
    const { checkState } = this.state;
    let labelArr = [];
    if (checkState.value === 'approved') {
      const newObj = [
        {
          evt: value => buckleState(value.status_id),
          labelStyle: value => convertStyle(value.status_id),
        },
        {
          evt: value => auditFinishedState(value),
          labelStyle: value => auditFinishedLabel(value),
        },
      ];
      labelArr = [...newObj];
    } else {
      const obj = {};
      obj.evt = value => buckleState(value.status_id);
      obj.labelStyle = value => convertStyle(value.status_id);
      labelArr.push(obj);
    }
    return labelArr;
  }
  render() {
    const { logList } = this.props;
    const { checkState, filter } = this.state;
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs
                  option={auditStates}
                  checkItem={checkState}
                  handleClick={this.tabChange}
                />
              </WingBlank>
            </WingBlank>
            <WhiteSpace size="md" />
          </div>
          <div className={style.filter_con}>
            <Flex
              justify="between"
              style={{ padding: '0 1.68rem' }}
            >
              <Flex.Item>
                <div
                  className={[style.dosort].join(' ')}
                  style={{
                    backgroundImage: `url(${this.state.sortItem.icon})`,
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '0.4rem',
                  }}
                  onClick={() => this.selFilter('sortModal')}
                >
                  {this.state.sortItem.name}
                </div>
              </Flex.Item>
              <Flex.Item>
                <div
                  className={[style.filter, Object.keys(this.dealFilter()).length ? style.active : null].join(' ')}
                  onClick={() => this.selFilter('filterModal')}
                >筛选
                </div>
              </Flex.Item>
            </Flex>
            <ListSort
              contentStyle={{
                position: 'fixed',
                zIndex: 99,
                left: 0,
                top: '2.3733333rem',
                bottom: 0,
                right: 0,
                overflow: 'auto',
              }}
              topStyle={{ height: '2.3466667rem' }}
              visible={this.state.modal.sortModal}
              onCancel={this.onCancel}
              filterKey="sortModal"
            >
              {sortList.map(item => (
                <div
                  className={style.sort_item}
                  key={item.name}
                  onClick={() => this.sortReasult(item)}
                >{item.name}
                </div>
              ))}
            </ListSort>
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          {logList[checkState.value] && !logList[checkState.value].data.length ?
            (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
                <Nothing src={nothing} />
              </div>
            ) : (
              <WingBlank>
                <Buckle
                  dataSource={logList[checkState.value] ? logList[checkState.value].data : []}
                  handleClick={this.toLookDetail}
                  onRefresh={this.onRefresh}
                  onPageChange={this.onPageChange}
                  label={this.renderLalbel()}
                  page={logList[checkState.value] ?
                    logList[checkState.value].page : 1}
                  totalpage={logList[checkState.value] ?
                    logList[checkState.value].totalpage : 10}
                />
              </WingBlank>
            )}

        </Flex.Item>
        <ListFilter
          onOk={this.onFilterOk}
          filterKey="filterModal"
          onCancel={this.onCancel}
          onResetForm={this.onResetForm}
          iconStyle={{ width: '0.533rem', height: '0.533rem' }}
          visible={this.state.modal.filterModal}
          contentStyle={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            textAlign: 'left',
            backgroundColor: 'rgba(0,0,0,0.2)',
            paddingLeft: '2rem',
          }}
        >
          {checkState.value !== 'approved' ? (
            <div className={style.filter_item}>
              <div className={style.title}>事件状态</div>
              <CheckBoxs
                option={stateOption}
                checkStatus={(i, v) => this.checkItem(i, v, 'eventState')}
                value={[filter.eventState]}
              />
            </div>
          ) : (
            <div className={style.filter_item}>
              <div className={style.title}>审核类型</div>
              <CheckBoxs
                option={procesingOption}
                checkStatus={(i, v) => this.doMultiple(i, v, 'approveType')}
                value={filter.approveType}
              />
              <div className={style.title}>事件状态</div>
              <CheckBoxs
                option={dealtOption}
                checkStatus={(i, v) => this.checkItem(i, v, 'eventState')}
                value={[filter.eventState]}
              />
            </div>
            )}
        </ListFilter>
      </Flex>
    );
  }
}

