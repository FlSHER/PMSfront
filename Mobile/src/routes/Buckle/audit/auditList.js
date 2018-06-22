import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { Buckle } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs, ListSort, StateTabs, Nothing } from '../../../components/index';
import style from '../index.less';
// import shortcut from '../../../assets/shortcuts.png';

const sortList = [
  { name: '默认排序', value: 'created_at-asc' },
  { name: '时间升序', value: 'created_at-asc' },
  { name: '时间降序', value: 'created_at-desc' },
];
const auditState = [
  { name: '待审核', value: 'procesing' },
  { name: '已审核', value: 'dealt' },
];
const dealtOption = [{ name: '通过', value: 2 }, { name: '驳回', value: -1 }];
const procesingOption = [{ name: '初审', value: 1 }, { name: '待审核', value: 0 }];
@connect(({ buckle }) => ({
  auditList: buckle.auditList,
}))
export default class AuditList extends React.Component {
  state = {
    filter: {// 筛选结果
      statusId: '',
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: 'created_at-asc' },
    checkState: { name: '待审核', value: 'procesing' },
  }
  componentWillMount() {
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
  onPageChange = () => {
    const { dispatch, buckleList } = this.props;
    const { checkState } = this.state;
    dispatch({
      type: 'buckle/getAuditList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        page: buckleList[checkState.value].page + 1,
      },
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  onRefresh = () => {
    setTimeout(() => {
      this.setState({

      });
    }, 1000);
  }
  onCancel = (e, feild) => {
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = false;
    this.setNewState('modal', newModal);
  }
  onResetForm = () => {
    this.setNewState('filter', {});
  }
  onFilterOk = () => {
    const { filter, checkState, sortItem } = this.state;
    const { dispatch } = this.props;
    const search = {
      status_id: filter.statusId,
    };
    dispatch({
      type: 'buckle/getAuditList',
      payload: {
        pagesize: 10,
        type: checkState.value,
        page: 1,
        sort: sortItem.value,
        filters: search,
      },
    });
    this.onCancel('', 'filterModal');
    this.onCancel('', 'filterModal');
  }
  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
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
    const { filter } = this.props;
    const newFilter = { ...filter };
    newFilter[key] = v;
    this.setNewState('filter', newFilter);
  }
  tabChange = (item) => {
    const { dispatch, auditList } = this.props;
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
        },
      });
    });
  }

  toLookDetail = (item) => {
    this.props.history.push(`/audit_detail/${item.id}`);
  }
  render() {
    const { auditList } = this.props;
    const { checkState, filter } = this.state;
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs option={auditState} checkItem={checkState} justify="around" handleClick={this.tabChange} />
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
                  className={[style.dosort, this.state.sortItem.value === -1 ?
                    null : style.active].join(' ')}
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
                onPageChange={this.onPageChange}
                page={auditList[checkState.value] ? auditList[checkState.value].page : 1}
                totalpage={auditList[checkState.value] ? auditList[checkState.value].totalpage : 10}
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
            <div className={style.title}>流程</div>
            <CheckBoxs
              option={checkState.value === 'procesing' ? procesingOption : dealtOption}
              checkStatus={(i, v) => this.checkItem(i, v, 'statusId')}
              value={[filter.statusId]}
            />
          </div>

        </ListFilter>
      </Flex>
    );
  }
}

