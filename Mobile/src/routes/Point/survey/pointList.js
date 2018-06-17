import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
// import defaultAvatar from '../../../assets/default_avatar.png';
// import style from '../index.less';
// import styles from '../../common.less';
import { Point } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs, ListSort, StateTabs } from '../../../components/index';
import style from '../index.less';
// import shortcut from '../../../assets/shortcuts.png';

const sortList = [
  { name: '默认排序', value: -1 },
  { name: '时间升序', value: 1 },
  { name: '时间降序', value: 2 },
  { name: '分值升序', value: 3 },
  { name: '分值降序', value: 4 },
];
const auditState = [
  { name: '奖扣积分', value: 1 },
  { name: '任务积分', value: 2 },
  { name: '基础积分', value: 3 },
  { name: '系统积分', value: 4 },
];

@connect()
export default class PointList extends React.Component {
  state = {
    filter: {// 筛选结果
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: -1 },
    checkState: { name: '奖扣积分', value: 1 },
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
    this.props.history.push('/point_detail/1');
  }
  render() {
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <WingBlank size="lg">
              <WingBlank size="lg">
                <StateTabs
                  option={auditState}
                  checkItem={this.state.checkState}
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
            <Point
              dataSource={[1, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6]}
              handleClick={this.toLookDetail}
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
            <div className={style.title}>分值区间</div>
            <div className={style.title}>生效时间</div>
          </div>

        </ListFilter>
      </Flex>
    );
  }
}

