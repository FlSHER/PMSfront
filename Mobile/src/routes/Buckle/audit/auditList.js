import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, Modal } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { Buckle } from '../../../common/ListView/index';
import {
  auditState,
  auditLabel,
  convertStyle,
  auditFinishedState,
  buckleState,
  auditFinishedLabel,
} from '../../../utils/convert.js';
import { userStorage } from '../../../utils/util';

import { ListFilter, CheckBoxs, ListSort, StateTabs, Nothing } from '../../../components/index';
import style from '../index.less';
// import shortcut from '../../../assets/shortcuts.png';

const sortList = [
  { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
];
const auditStates = [
  { name: '待审核', value: 'processing' },
  { name: '已审核', value: 'approved' },
];
const dealtOption = [
  { name: '已通过', value: 1 },
  { name: '已驳回', value: -1 },
];
const procesingOption = [
  { name: '初审', value: 'first_approver_sn' },
  { name: '终审', value: 'final_approver_sn' },
];
@connect(({ buckle }) => ({
  auditList: buckle.auditList,
}))
export default class AuditList extends React.Component {
  state = {
    filter: {// 筛选结果
      approveType: [],
      eventState: '',
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: 'created_at-asc' },
    checkState: { name: '待审核', value: 'processing' },
    el: {},
    shortModal: false,
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const { checkState } = this.state;
    const newInfo = userStorage('userInfo');
    this.setState({
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'buckle/getAuditList',
        payload: {
          pagesize: 10,
          page: 1,
          type: checkState.value,
        },
      });
    });
  }
  onPageChange = () => {
    const { dispatch, auditList } = this.props;
    const { checkState, sortItem } = this.state;
    dispatch({
      type: 'buckle/getAuditList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        sort: sortItem.value,
        page: auditList[checkState.value].page + 1,
        filter: this.dealFilter(),
      },
    });
  }
  onClose = (key) => {
    this.setState({
      [key]: false,
    });
  }
  onRefresh = () => {
    const { dispatch } = this.props;
    const { checkState } = this.state;
    dispatch({
      type: 'buckle/getAuditList',
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
    const { checkState, sortItem } = this.state;
    const { dispatch } = this.props;
    this.setState({ filter: {} }, () => {
      dispatch({
        type: 'buckle/getAuditList',
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
    dispatch({
      type: 'buckle/getAuditList',
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
  onShortcut = (el) => {
    this.setState({
      el,
      shortModal: true,
    });
  }

  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }
  dealFilter = () => {
    const { filter } = this.state;
    const { userInfo } = this.state;
    const { approveType, eventState } = filter;
    const search = {};
    if (!(approveType.length === procesingOption.length) && approveType.length) { // 如果不是全选
      const appType = approveType[0];
      search[appType] = userInfo.staff_sn;
      if (appType === 'first_approver_sn') {
        search.status_id = eventState === 1 ? 1 : eventState;
      }
      if (appType === 'final_approver_sn') {
        search.status_id = eventState === 1 ? 2 : eventState;
      }
    }
    return search;
  }
  doAudit = (type, state) => {
    const { el } = this.state;
    const { dispatch, history } = this.props;
    dispatch({
      type: 'buckle/saveData',
      payload: {
        key: 'detail',
        value: el,
      },
    });
    history.push(`/audit_reason/${type}/${state}`);
  }
  sortReasult = (item) => {
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal.sortModal = false;
    this.setState({
      modal: { ...newModal },
      sortItem: item,
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
    const temp = newFilter[key] === v ? '' : v;
    newFilter[key] = temp;
    this.setNewState('filter', newFilter);
  }
  doMultiple = (i, v, key) => {
    const { filter } = this.state;
    const newFilter = { ...filter };
    let temp = [...(newFilter[key] || [])];
    const isExist = temp.includes(v);
    if (isExist) {
      temp = temp.filter(item => item !== v);
    } else {
      temp.push(v);
    }
    newFilter[key] = [...temp];
    this.setNewState('filter', newFilter);
  }
  tabChange = (item) => {
    const { dispatch, auditList } = this.props;
    const { sortItem } = this.state;
    this.setState({
      checkState: item,
    }, () => {
      if (auditList[item.value]) {
        return;
      }
      dispatch({
        type: 'buckle/getAuditList',
        payload: {
          pagesize: 10,
          type: item.value,
          page: 1,
          sort: sortItem.value,
        },
      });
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
        type: 'buckle/getAuditList',
        payload: {
          pagesize: 10,
          type: checkState.value,
          page: 1,
          sort: item.value,
        },
      });
    });
  }
  toLookDetail = (item) => {
    this.props.history.push(`/audit_detail/${item.id}`);
  }


  renderLalbel = () => {
    const { checkState } = this.state;
    let labelArr = [];
    if (checkState.value === 'processing') {
      const obj = {};
      obj.evt = value => auditState(value.status_id);
      obj.labelStyle = value => auditLabel(value.status_id);
      labelArr.push(obj);
    }
    if (checkState.value === 'approved') {
      const newObj = [
        { evt: value => buckleState(value.status_id),
          labelStyle: value => convertStyle(value.status_id) },
        { evt: value => auditFinishedState(value),
          labelStyle: value => auditFinishedLabel(value) },
      ];
      labelArr = [...newObj];
    }
    return labelArr;
  }
  render() {
    const { auditList } = this.props;
    const { checkState, filter, el, shortModal, userInfo } = this.state;
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs option={auditStates} checkItem={checkState} justify="around" handleClick={this.tabChange} />
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
                  style={{ backgroundImage: `url(${item.icon}) no-repeat right center` }}
                  onClick={() => this.sortReasult(item)}
                >{item.name}
                </div>
              ))}
            </ListSort>
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          {auditList[checkState.value] && !auditList[checkState.value].data.length ?
            (
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
                <Nothing src={nothing} />
              </div>
            ) : (
              <WingBlank>
                <Buckle
                  dataSource={auditList[checkState.value] ? auditList[checkState.value].data : []}
                  handleClick={this.toLookDetail}
                  onRefresh={this.onRefresh}
                  onPageChange={this.onPageChange}
                  hasShortcut={checkState.value !== 'approved'}
                  onShortcut={checkState.value === 'approved' ? null : this.onShortcut}
                  label={this.renderLalbel()}
                  page={auditList[checkState.value] ?
                     auditList[checkState.value].page : 1}
                  totalpage={auditList[checkState.value] ?
                     auditList[checkState.value].totalpage : 10}
                >
                  <Modal
                    popup
                    visible={checkState.value === 'approved' ? false : shortModal}
                    onClose={() => this.onClose('shortModal')}
                    animationType="slide-up"
                  >
                    <div
                      style={{ background: 'rgba(0, 0, 0, 0.4)' }}
                      onClick={(e) => {
                        e.stopPropagation(); return false;
                      }}
                    >
                      <WingBlank>
                        <Flex
                          direction="column"
                        >
                          <Flex.Item className={style.base_opt}>
                            {el.first_approver_sn === userInfo.staff_sn && el.status_id === 0 ?
                              (
                                <div
                                  className={[style.opt_item, style.reject].join(' ')}
                                  onClick={() => this.doAudit('1', 'no')}
                                >初审驳回
                                </div>
                              ) : null}
                            {el.first_approver_sn === userInfo.staff_sn && el.status_id === 0 ?
                              (
                                <div
                                  className={[style.opt_item, style.agree].join(' ')}
                                  onClick={() => this.doAudit('1', 'yes')}
                                >初审通过
                                </div>
                              ) : null}
                            {el.final_approver_sn === userInfo.staff_sn && el.status_id === 1 ?
                              (
                                <div
                                  className={[style.opt_item, style.reject].join(' ')}
                                  onClick={() => this.doAudit('2', 'no')}
                                >终审驳回
                                </div>
                              ) : null}
                            {el.final_approver_sn === userInfo.staff_sn && el.status_id === 1 ?
                              (
                                <div
                                  className={[style.opt_item, style.agree].join(' ')}
                                  onClick={() => this.doAudit('2', 'yes')}
                                >终审通过
                                </div>
                              ) : null}

                          </Flex.Item>
                          <Flex.Item
                            onClick={() => this.onClose('shortModal')}
                            className={[style.opt_item, style.cancel].join(' ')}
                          >取消
                          </Flex.Item>
                        </Flex>

                      </WingBlank>
                    </div>
                  </Modal>

                </Buckle>
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
          {checkState.value === 'processing' ? (
            <div className={style.filter_item}>
              <div className={style.title}>审核类型</div>
              <CheckBoxs
                option={procesingOption}
                checkStatus={(i, v) => this.doMultiple(i, v, 'approveType')}
                value={filter.approveType}
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
