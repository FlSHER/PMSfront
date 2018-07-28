import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, Modal } from 'antd-mobile';
import { Buckle } from '../../../common/ListView/index';
import ModalFilters from '../../../components/ModalFilters';

import {
  auditState,
  auditLabel,
  convertStyle,
  auditFinishedState,
  auditFinishedLabel,
  auditFinishedResult,
} from '../../../utils/convert.js';
import { userStorage, getUrlParams, getUrlString, parseParamsToUrl, doConditionValue, parseParams } from '../../../utils/util';

import { StateTabs } from '../../../components/index';
import style from '../index.less';
import shortcut from '../../../assets/shortcuts.png';


const tabs = {
  processing: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        options: [
          {
            label: '初审', value: '0',
          },
          {
            label: '终审', value: '1',
          },
        ],
      },
    ],
  },
  approved: {
    filterColumns: [
      {
        name: 'state',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        notbelong: true,
        options: [
          {
            label: '初审', value: 'first_approved_at',
          },
          {
            label: '终审', value: 'final_approved_at',
          },
        ],
      },
      {
        name: 'cate',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        notbelong: true,
        options: [
          {
            label: '已通过', value: 'audit',
          },
          {
            label: '已驳回', value: 'reject',
          },
        ],
      },
    ],
  },
};

const sortList = [
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
@connect(({ buckle, alltabs }) => ({
  auditList: buckle.auditList,
  allTabs: alltabs.tabs,
}))
export default class AuditList extends React.Component {
  state = {
    visible: false,
    model: 'filters',
    el: {},
    shortModal: false,
    sorter: { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  }

  componentWillMount() {
    const { auditList } = this.props;
    console.log('willmount');
    const newInfo = userStorage('userInfo');
    this.urlParams = getUrlParams();
    const { type = 'processing' } = this.urlParams;
    this.type = type;
    this.setState({
      userInfo: newInfo,
    });
    if (auditList[type]) {
      return;
    }
    this.fetchDataSource({});
    // const currentTab = allTabs[this.type];
    // const currentParams = getUrlParams(currentTab);
    // const newParams = { ...currentParams, ...params, page: 1, pagesize: 10 };
    // const urlparams = parseParamsToUrl(newParams);
    // dispatch({
    //   type: 'buckle/getAuditList2',
    //   payload: {
    //     url: urlparams,
    //     type: this.type,
    //   },
    // });
  }

  componentWillReceiveProps(props) {
    const { location: { search }, auditList } = props;
    this.urlParams = getUrlParams(search);
    const { type = 'processing' } = this.urlParams;
    this.type = type;
    if (this.props.location.search !== search) {
      if (auditList[type]) {
        return;
      }
      this.fetchDataSource({});
    }
  }

  onPageChange = () => {
    const { dispatch, auditList } = this.props;
    const { checkState, sortItem } = this.state;
    dispatch({
      type: 'buckle/getAuditList2',
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
    const { checkState, sortItem } = this.state;
    dispatch({
      type: 'buckle/getAuditList2',
      payload: {
        pagesize: 10,
        page: 1,
        type: checkState.value,
        sort: sortItem.value,
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
    this.setState({ filter: {} }, () => {
      dispatch({
        type: 'buckle/getAuditList2',
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
      type: 'buckle/getAuditList2',
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

  fetchDataSource = (params) => {
    const { dispatch, allTabs } = this.props;
    const currentTab = allTabs[this.type];
    const filterParams = getUrlString('filters', currentTab);
    this.filters = doConditionValue(filterParams);
    const currentParams = parseParams(currentTab);
    console.log('currentParams',currentParams)
    const newParams = { ...currentParams, ...params, page: 1, pagesize: 10 };
    const urlparams = parseParamsToUrl(newParams);
    dispatch({
      type: 'alltabs/saveKey',
      payload: {
        type: this.type,
        value: urlparams,
      },
    });
    dispatch({
      type: 'buckle/getAuditList2',
      payload: {
        url: urlparams,
        type: this.type,
      },
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
    history.push(`/audit_reason/${type}/${state}/-1`);
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
    const { history } = this.props;
    history.replace(`/audit_list_2?type=${item.value}`);
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
        type: 'buckle/getAuditList2',
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
    const { dispatch, history } = this.props;
    dispatch({
      type: 'buckle/save',
      payload: {
        store: 'auditList',
        data: {},
      },
    });
    history.push(`/event_preview/${item.id}`);
  }


  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  renderExtraContent = (value) => {
    const extra = (
      <div className={style.aside}>
        <img
          src={shortcut}
          alt="快捷操作"
          onClick={() => { this.onShortcut(value); }}
        />
      </div>
    );
    return extra;
  }

  renderLalbel = () => {
    const { type } = this;
    let labelArr = [];
    if (type === 'processing') {
      const obj = {};
      obj.evt = value => auditState(value.status_id);
      obj.labelStyle = value => auditLabel(value.status_id);
      labelArr.push(obj);
    }
    if (type === 'approved') {
      const newObj = [
        {
          evt: value => auditFinishedResult(value.status_id),
          labelStyle: value => convertStyle(value.status_id),
        },
        {
          evt: value => auditFinishedState(value),
          labelStyle: value => auditFinishedLabel(value),
        },
      ];
      labelArr = [...newObj];
    }
    return labelArr;
  }

  render() {
    const { auditList } = this.props;
    const { el, userInfo, sorter, shortModal } = this.state;
    const { type } = this;
    const { filterColumns } = tabs[type];
    // const isFilter = makerFilters(filter).filters;
    const linkBtn = [];
    if (Object.keys(el).length) {
      const detail = { ...el };
      const statusId = detail.status_id.toString();
      const reject = (
        <div
          key="reject"
          className={[style.opt_item, style.reject].join(' ')}
          onClick={() => this.doAudit(statusId, 'no')}
        >
          驳回
        </div>
      );
      const pass = (
        <div
          key="pass"
          className={[style.opt_item, style.agree].join(' ')}
          onClick={() => this.doAudit(statusId, 'yes')}
        >
          通过
        </div>
      );

      if (
        (detail.first_approver_sn === userInfo.staff_sn && detail.status_id === 0)
        ||
        (detail.final_approver_sn === userInfo.staff_sn && detail.status_id === 1)
      ) {
        // 初审 || 终审
        linkBtn.push(reject);
        linkBtn.push(pass);
      }
    }
    const isApproved = this.type === 'approved';
    const extra = !isApproved ? this.renderExtraContent : null;
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs option={auditStates} checkItem={{ value: this.type }} justify="around" handleClick={this.tabChange} />
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
                  onClick={() => this.handleVisible(true, 'sort')}
                >
                  {sorter.name}
                </div>
              </Flex.Item>
              <Flex.Item>
                <div
                  className={[style.filter ? style.active : null].join(' ')}
                  onClick={() => this.handleVisible(true, 'filter')}
                >筛选
                </div>

              </Flex.Item>
            </Flex>
            <ModalFilters
              visible={this.state.visible}
              model={this.state.model}
              filters={this.filters}
              sorter={sorter.value}
              filterColumns={filterColumns}
              sorterData={sortList}
              // modalId="1"
              fetchDataSource={this.fetchDataSource}
              onCancel={this.handleVisible}
            />
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          <WingBlank>
            <Buckle
              extra={extra}
              onRefresh={this.onRefresh}
              dataSource={auditList[type] ? auditList[type].data : []}
              handleClick={this.toLookDetail}
              onPageChange={this.onPageChange}
              label={this.renderLalbel() || []}
              page={auditList[type] ?
                auditList[type].page : 1}
              totalpage={auditList[type] ?
                auditList[type].totalpage : 10}
            />
          </WingBlank>
        </Flex.Item>
        <Modal
          popup
          visible={!isApproved && shortModal}
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
                  {linkBtn}
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
      </Flex>
    );
  }
}

