import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
// import defaultAvatar from '../../../assets/default_avatar.png';
// import style from '../index.less';
// import styles from '../../common.less';
import { Buckle } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs, ListSort, StateTabs } from '../../../components/index';
import style from '../index.less';

const sortList = [
  { name: '默认排序', value: -1 },
  { name: '时间升序', value: 1 },
  { name: '时间降序', value: 2 },
];
const auditState = [
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
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: -1 },
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
    const { dispatch, buckleList } = this.props;
    const { checkState } = this.state;
    dispatch({
      type: 'buckle/getLogsList',
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
    this.setNewState('checkState', item);
  }
  toLookDetail = () => {
    this.props.history.push('/audit_detail/1');
  }
  render() {
    const { logList } = this.props;
    const { checkState } = this.state;
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs
                  option={auditState}
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
                  key={item.value}
                  onClick={() => this.sortReasult(item)}
                >{item.name}
                </div>
              ))}
            </ListSort>
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          <WingBlank>
            <Buckle
              dataSource={logList[checkState.value] ? logList[checkState.value].data : []}
              handleClick={this.toLookDetail}
              hasShortcut={false}
              onPageChange={this.onPageChange}
              page={logList[checkState.value] ? logList[checkState.value].page : 1}
              totalpage={logList[checkState.value] ? logList[checkState.value].totalpage : 10}
            />
          </WingBlank>
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
              option={[{ name: 1, value: '1' }, { name: 'xxx', value: '2' }]}
              checkStatus={(i, v) => this.checkItem(i, v, 'approType')}
              value={[this.state.filter.approType ? this.state.filter.approType : '']}
            />
          </div>

        </ListFilter>
      </Flex>
    );
  }
}

