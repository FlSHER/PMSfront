import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
import { Buckle, PaticipantBuckle } from '../../../common/ListView/index';
import ModalFilters from '../../../components/ModalFilters';
import {
  buckleState,
  convertStyle,
} from '../../../utils/convert.js';
import { getUrlParams, getUrlString, parseParamsToUrl, doConditionValue, parseParams } from '../../../utils/util';

import { StateTabs } from '../../../components/index';
import style from '../index.less';
import shortcut from '../../../assets/shortcuts.png';

const options = [
  {
    label: '已通过', value: '2',
  },
  {
    label: '已驳回', value: '-1',
  },
  {
    label: '审核中', value: '[0,1]',
  },
  {
    label: '已撤回', value: '-2',
  },
];

const addrOption = [
  {
    label: '已通过', value: '2',
  },
  {
    label: '已驳回', value: '-1',
  },
];
const tabs = {
  participant: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        options,
      },
    ],
  },
  recorded: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        options,
      },
    ],
  },
  addressee: {
    filterColumns: [
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        options: addrOption,
      },
    ],
  },
};

const sortList = [
  { name: '记录时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '记录时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: '执行时间升序', value: 'executed_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '执行时间降序', value: 'executed_at-desc', icon: import('../../../assets/filter/desc.svg') },
];

const auditStates = [
  { name: '我参与的', value: 'participant' },
  { name: '我记录的', value: 'recorded' },
  { name: '抄送我的', value: 'addressee' },
];

@connect(({ buckle, alltabs }) => ({
  logList: buckle.logList,
  allTabs: alltabs.tabs,
}))
export default class AuditList extends React.Component {
  state = {
    visible: false,
    model: 'filters',
    page: 1,
    totalpage: 10,
  }

  componentWillMount() {
    const { logList } = this.props;
    this.urlParams = getUrlParams();
    const { type = 'participant' } = this.urlParams;
    this.type = type;
    if (logList[type] && logList[type].page !== 1) {
      this.currentFilter();
      return;
    }
    this.fetchDataSource({});
  }

  componentWillReceiveProps(props) {
    const { location: { search }, logList } = props;
    this.urlParams = getUrlParams(search);
    const { type = 'participant' } = this.urlParams;
    this.type = type;
    if (JSON.stringify(this.props.logList[type]) !== JSON.stringify(logList[type])) {
      const page = logList[type] ? logList[type].page : 1;
      const totalpage = logList[type] ? logList[type].totalpage : 10;
      this.setState({
        totalpage,
        page,
      });
    }

    this.currentFilter();
    if (this.props.location.search !== search) {
      if (logList[type] && logList[type].page !== 1) {
        return;
      }
      this.fetchDataSource({});
    }
  }

  onPageChange = () => {
    const { logList } = this.props;
    const currentData = logList[this.type];
    const params = {
      page: currentData ? currentData.page + 1 : 1,
    };
    this.setState({
      page: params.page,
    });
    this.fetchDataSource(params);
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


  findNotBelong = () => {
    const { filterColumns = [] } = tabs[this.type] || {};
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

  fetchFiltersDataSource=(params) => {
    this.setState({
      page: 1,
    }, () => {
      this.fetchDataSource({ ...params, page: 1 });
    });
  }

  fetchDataSource = (params) => {
    const { dispatch, allTabs, logList } = this.props;
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
      type: 'buckle/getBuckleList2',
      payload: {
        url: urlparams,
        type: this.type,
      },
    });
  }

  tabChange = (item) => {
    const { history } = this.props;
    history.replace(`/buckle_list_2?type=${item.value}`);
  }

  toLookDetail = (url) => {
    const { history } = this.props;
    history.push(url);
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
    const labelArr = [];
    const obj = {};
    obj.evt = value => buckleState(value.status_id);
    obj.labelStyle = value => convertStyle(value.status_id);
    labelArr.push(obj);

    return labelArr;
  }

  render() {
    const { logList } = this.props;
    const { type } = this;
    const { filterColumns = [] } = tabs[type] || {};
    let [sortItem] = sortList.filter(item => item.value === this.sorter);
    if (!sortItem) {
      [sortItem] = sortList;
    }
    const activeStyle = Object.keys(this.filters || {}).length ? style.active : null;
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <StateTabs
                option={auditStates}
                checkItem={{ value: this.type }}
                justify="around"
                handleClick={this.tabChange}
              />
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
              // modalId="1"
              fetchDataSource={this.fetchFiltersDataSource}
              onCancel={this.handleVisible}
            />
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          {type === 'participant' && (
            <PaticipantBuckle
              dataSource={logList[type] ? logList[type].data : []}
              handleClick={item => this.toLookDetail(`/audit_detail/${item.id}`)}
              onRefresh={this.onRefresh}
              onPageChange={this.onPageChange}
              label={this.renderLalbel()}
              page={this.state.page}
              totalpage={this.state.totalpage}
            />
          )}
          {type !== 'participant' && (
            <Buckle
              dataSource={logList[type] ? logList[type].data : []}
              handleClick={item => this.toLookDetail(`/event_preview/${item.id}`)}
              onRefresh={this.onRefresh}
              onPageChange={this.onPageChange}
              label={this.renderLalbel()}
              page={this.state.page}
              totalpage={this.state.totalpage}
            />
          )}
        </Flex.Item>
      </Flex>
    );
  }
}

