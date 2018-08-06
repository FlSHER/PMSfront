import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Flex, Modal, Tabs } from 'antd-mobile';
import { Buckle, Auditted } from '../../../common/ListView/index';
import ModalFilters from '../../../components/ModalFilters';

import {
  auditState,
  auditLabel,
  // convertStyle,
  auditFinishedState,
  auditFinishedLabel,
  auditFinishedResult,
  auditFinishedResultLabel,
} from '../../../utils/convert.js';
import { userStorage, getUrlParams, getUrlString, parseParamsToUrl, doConditionValue, parseParams } from '../../../utils/util';
import style from '../index.less';
import shortcut from '../../../assets/shortcuts.png';


const tabs = {
  processing: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核环节',
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
        name: 'step',
        type: 'checkBox',
        title: '审核环节',
        multiple: false,
        notbelong: true,
        options: [
          {
            label: '初审', value: 'first',
          },
          {
            label: '终审', value: 'final',
          },
        ],
      },
      {
        name: 'cate',
        type: 'checkBox',
        title: '操作',
        multiple: false,
        notbelong: true,
        options: [
          {
            label: '通过', value: 'audit',
          },
          {
            label: '驳回', value: 'reject',
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
const auditTabs = [
  { name: '待我审核的', value: 'processing', title: '待我审核的' },
  { name: '我已审核的', value: 'approved', title: '我已审核的' },
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
    page: 1,
    totalpage: 10,
  }

  componentWillMount() {
    const { auditList } = this.props;
    const newInfo = userStorage('userInfo');
    this.urlParams = getUrlParams();
    const { type = 'processing' } = this.urlParams;
    this.type = type;
    this.setState({
      userInfo: newInfo,
    });
    if ((auditList[type] && auditList[type].page !== 1)) {
      this.currentFilter();
      return;
    }
    this.fetchDataSource({});
  }

  componentWillReceiveProps(props) {
    const { location: { search }, auditList } = props;
    this.urlParams = getUrlParams(search);
    const { type = 'processing' } = this.urlParams;
    this.type = type;
    if (JSON.stringify(this.props.auditList[type]) !== JSON.stringify(auditList[type])) {
      const page = auditList[type] ? auditList[type].page : 1;
      const totalpage = auditList[type] ? auditList[type].totalpage : 10;
      this.setState({
        totalpage,
        page,
      });
    }

    this.currentFilter();
    if (this.props.location.search !== search) {
      if (auditList[type] && auditList[type].page !== 1) {
        return;
      }
      this.fetchDataSource({});
    }
  }

  onPageChange = () => {
    const { auditList } = this.props;
    const currentData = auditList[this.type];
    const params = {
      page: currentData ? currentData.page + 1 : 1,
    };
    this.setState({
      page: params.page,
    }, () => {
      this.fetchDataSource(params);
    });
  }

  onRefresh = () => {
    const params = {
      page: 1,
    };
    this.setState({
      page: params.page,
    }, () => {
      this.fetchDataSource(params);
    });
  }

  onResetForm = () => {
    const { dispatch } = this.props;
    this.setState({
      page: 1,
    });
    dispatch({
      type: 'alltabs/saveKey',
      payload: {
        type: this.type,
        value: `sort=created_at-desc&type=${this.type}`,
      },
    });
  }


  onShortcut = (el) => {
    this.setState({
      el,
      shortModal: true,
    });
  }

  fetchFiltersDataSource = (params) => {
    this.setState({
      page: 1,
    }, () => {
      this.fetchDataSource({ ...params, page: 1 });
    });
  }

  findNotBelong = () => {
    const { filterColumns } = tabs[this.type];
    const notBelongs = filterColumns.filter(item => item.notbelong);
    return notBelongs;
  }

  currentFilter = () => {
    const { allTabs } = this.props;
    const currentTab = allTabs[this.type];
    let filterParams = getUrlString('filters', currentTab);
    // this.sorter = getUrlString('sort', currentTab);
    const notbelongs = this.findNotBelong();
    const notbelongParams = [];
    notbelongs.forEach((item) => {
      const str = getUrlString(item.name, currentTab);
      if (str) {
        notbelongParams.push(`${item.name}=${str}`);
      }
    });
    filterParams = `${notbelongParams.join(';')};${filterParams}`;
    this.filters = doConditionValue(filterParams);
  }

  fetchDataSource = (params) => {
    const { dispatch, allTabs } = this.props;
    const currentTab = allTabs[this.type];
    this.sorter = (params && params.sort) || 'created_at-desc';
    const currentParams = parseParams(currentTab);
    const newParams = { page: 1, pagesize: 10, ...currentParams, ...params, type: this.type };
    const urlparams = parseParamsToUrl(newParams);
    dispatch({
      type: 'alltabs/saveKey',
      payload: {
        type: this.type,
        value: urlparams,
      },
    });
    dispatch({
      type: 'buckle/getAuditList',
      payload: {
        url: urlparams,
        type: this.type,
      },
    });
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

  tabChange = (item) => {
    const { history } = this.props;
    history.replace(`/audit_list?type=${item.value}`);
  }

  toLookDetail = (item) => {
    const { history } = this.props;
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

  renderInitialPage = () => {
    let initialPage = 0;
    const { type } = this;
    auditTabs.forEach((item, i) => {
      if (item.value === type) {
        initialPage = i;
      }
    });
    return initialPage;
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
          evt: value => auditFinishedResult(value),
          labelStyle: value => auditFinishedResultLabel(value),
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
    const { el, userInfo, shortModal } = this.state;
    const { type } = this;

    const { filterColumns = [] } = tabs[type];
    // console.log('this.page', this.state.page);
    let [sortItem] = sortList.filter(item => item.value === this.sorter);
    if (!sortItem) {
      [sortItem] = sortList;
    }
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
    const activeStyle = Object.keys(this.filters || {}).length ? style.active : null;

    const isApproved = this.type === 'approved';
    // const extra = !isApproved ? this.renderExtraContent : null;
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <Tabs
              tabs={auditTabs}
              // checkItem={{ value: this.type }}
              initialPage={this.renderInitialPage()}
              justify="around"
              onTabClick={this.tabChange}
            />
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
                  style={{
                    backgroundImage: `url(${sortItem.icon})`,
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '0.4rem',
                  }}
                >
                  {sortItem.name}
                </div>
              </Flex.Item>
              <Flex.Item>
                <div
                  className={[style.filter, activeStyle].join(' ')}
                  onClick={() => this.handleVisible(true, 'filter')}
                >筛选
                </div>

              </Flex.Item>
            </Flex>
            <ModalFilters
              visible={this.state.visible}
              model={this.state.model}
              filters={this.filters}
              sorter={this.sorter}
              onResetForm={this.onResetForm}
              filterColumns={filterColumns}
              sorterData={sortList}
              fetchDataSource={this.fetchFiltersDataSource}
              onCancel={this.handleVisible}
            />
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          {type === 'processing' && (
            <Buckle
              // extra={extra}
              onRefresh={this.onRefresh}
              dataSource={auditList[type] ? auditList[type].data : []}
              handleClick={this.toLookDetail}
              onPageChange={this.onPageChange}
              label={this.renderLalbel() || []}
              page={this.state.page}
              totalpage={this.state.totalpage}
            />
          )}
          {type === 'approved' && (
            <Auditted
              // extra={extra}
              onRefresh={this.onRefresh}
              dataSource={auditList[type] ? auditList[type].data : []}
              handleClick={this.toLookDetail}
              onPageChange={this.onPageChange}
              label={this.renderLalbel() || []}
              page={this.state.page}
              totalpage={this.state.totalpage}
            />
          )}
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

