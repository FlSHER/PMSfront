import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, InputItem } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { Buckle } from '../../../common/ListView/index';
import { buckleState } from '../../../utils/convert.js';

import { ListFilter, CheckBoxs, ListSort, StateTabs, Nothing } from '../../../components/index';
import style from '../index.less';

const sortList = [
  { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
];
const auditStates = [
  { name: '全部', value: 'all' },
  { name: '我参与的', value: 'participant' },
  { name: '我记录的', value: 'recorded' },
  { name: '我审核的', value: 'approved' },
  { name: '抄送我的', value: 'addressee' },
];

@connect(({ buckle }) => ({
  logList: buckle.logList,
}))
export default class BuckleList extends React.Component {
  state = {
    filter: {// 筛选结果
      point: 'point_a',
      range: { min: 0, max: 2000 },
      time: {
        year: '',
        month: {
          min: 1, max: 12,
        },
      },
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
    checkState: { name: '全部', value: 'all' },
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        type: 'all',
        page: 1,
      },
    });
  }
  onPageChange = () => {
    const { dispatch, logList } = this.props;
    const { checkState } = this.state;
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        page: logList[checkState.value].page + 1,
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
    const { checkState } = this.state;
    dispatch({
      type: 'buckle/getBuckleList',
      payload: {
        pagesize: 10,
        page: 1,
        type: checkState.value,
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
    this.setNewState('filter',
      {
        point: '',
        range: { min: 0, max: 2000 },
        time: {
          year: '',
          month: {
            min: 1, max: 12,
          },
        },
      });
  }
  onFilterOk = () => {
    const { filter, checkState, sortItem } = this.state;
    const { dispatch } = this.props;
    const search = {
      created_at: {
        min: `${filter.time.year}-${filter.time.month.min}-01`,
        max: `${filter.time.year}-${filter.time.month.max}-01`,
      },
    };
    search[filter.point] = {
      min: filter.range.min,
      max: filter.range.max,
    };
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        page: 1,
        sort: sortItem.value,
        filters: search,
      },
    });
    this.onCancel('', 'filterModal');
  }
  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
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
    const newModal = { ...modal };
    newModal[feild] = true;
    this.setNewState('modal', newModal);
  }

  checkItem = (i, v, key) => {
    const { filter } = this.state;
    const newFilter = { ...filter };
    newFilter[key] = v;
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
    const labelArr = [];
    const obj = {};
    obj.evt = value => buckleState(value.status_id);
    labelArr.push(obj);
    return labelArr;
  }
  render() {
    const { logList } = this.props;
    const { checkState, filter } = this.state;
    return (
      <Flex direction="column" style={{ height: '100%' }}>
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
                  className={[style.filter, Object.keys(this.state.filter).length ? style.active : null].join(' ')}
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
                background: 'rgba(0, 0, 0, 0.1)',
              }}
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
                  hasShortcut={false}
                  onRefresh={this.onRefresh}
                  label={this.renderLalbel()}
                  onPageChange={this.onPageChange}
                  page={logList[checkState.value] ? logList[checkState.value].page : 1}
                  totalpage={logList[checkState.value] ? logList[checkState.value].totalpage : 10}
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

          <div className={style.filter_item}>
            <div className={style.title}>分值类型</div>
            <CheckBoxs
              option={[{ name: 'A分', value: 'point_a' }, { name: 'B分', value: 'point_b' }]}
              checkStatus={(i, v) => this.checkItem(i, v, 'point')}
              value={[filter.point]}
            />
          </div>
          <div className={[style.filter_item, style.range].join(' ')} >
            <div className={style.title}>分值区间</div>
            <Flex>
              <InputItem
                type="number"
                value={filter.range.min}
                onChange={e => this.rangeChange(e, 'min')}
              /><span className={style.rg}>—</span><InputItem
                type="number"
                value={filter.range.max}
                onChange={e => this.rangeChange(e, 'max')}
              />
            </Flex>
          </div>
          <div className={[style.filter_item, style.range].join(' ')} >
            <div className={style.title}>生效时间</div>
            <Flex>
              <InputItem
                type="number"
                value={filter.time.year}
                onChange={e => this.yearChange(e, 'year')}
              />
              <span className={style.rg}>年</span>
              <InputItem
                type="number"
                value={filter.time.month.min}
                onChange={e => this.monthChange(e, 'min')}
              />
              <span className={style.rg}>—</span>
              <InputItem
                type="number"
                value={filter.time.month.max}
                onChange={e => this.monthChange(e, 'max')}
              />
            </Flex>
          </div>
        </ListFilter>
      </Flex>
    );
  }
}

