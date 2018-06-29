import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, List } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { analyzePath, userStorage } from '../../../utils/util';
import position from '../../../assets/ranking_pos.svg';
import { ListSort, Nothing } from '../../../components/index';
import style from '../index.less';

const sortList = [
  { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'A分升序', value: 'point_a-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'A分降序', value: 'point_a_-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'B分升序', value: 'point_b_-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'B分降序', value: 'point_b_-desc', icon: import('../../../assets/filter/desc.svg') },
];


@connect(({ ranking }) => ({
  ranking: ranking.ranking,
}))
export default class PointRanking extends React.Component {
  state = {
    sortItem: { name: '默认排序', value: 'created_at-asc' },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
      // groupId: '',
    },
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    const groupId = analyzePath(location.pathname, 1);
    const newInfo = userStorage('userInfo');
    this.setState({
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'ranking/getRanking',
        payload: { group_id: groupId, stage: 'month' },
      });
    });
  }
  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }
  selFilter = (feild) => { // 筛选
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = true;
    this.setNewState('modal', newModal);
  }

  renderRankingItem = (item) => {
    const { userInfo } = this.state;
    for (let i = 0; i < 50; i += 1) {
      return (
        <List.Item
          key={item.staff_sn}
          extra={item.point_b_total}
        >
          {item.staff_sn === userInfo.staff_sn ? <span id="my">{item.staff_name}</span> : item.staff_name}
        </List.Item>
      );
    }
  }
  render() {
    const { ranking } = this.props;
    const { list, user } = ranking;
    return (
      <Flex direction="column" style={{ height: '100%', background: 'rgb(240,240,240)' }}>
        <Flex.Item className={style.header}>
          <div className={style.filter_con} style={{ display: 'none' }}>
            <Flex
              justify="between"
              style={{ padding: '0 1.68rem', display: 'none' }}
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
                  className={[style.filter].join(' ')}
                  onClick={() => this.selFilter('filterModal')}
                >日期筛选
                </div>
              </Flex.Item>
            </Flex>
            <ListSort
              contentStyle={{
                position: 'fixed',
                zIndex: 99,
                left: 0,
                top: '1.17333rem',
                bottom: 0,
                right: 0,
                background: 'rgba(0, 0, 0, 0.1)',
              }}
              visible={this.state.modal.sortModal}
              onCancel={this.onCancel}
              filterKey="sortModal"
            >
              {sortList.map((item, i) => {
                const idx = i;
                return (
                  <div
                    className={style.sort_item}
                    key={idx}
                    onClick={() => this.sortReasult(item)}
                  >{item.name}
                  </div>
                );
              })}
            </ListSort>
          </div>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px' }}>我的排名</p>
            <div className={style.my_rank}>
              <div className={style.compare}>
                <p className={style.rank_result}>部门排名{user ? user.rank : ''}</p>
              </div>
              <div className={style.jump} ><a href="#my"><img src={position} alt="定位" /></a></div>
            </div>
          </WingBlank>
        </Flex.Item>
        <Flex.Item className={style.content}>
          {list && !list.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
              <Nothing src={nothing} />
            </div>
          ) : (
            <WingBlank>
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px' }}>排名详情</p>

              <List>
                {(list || []).map((item) => {
               return this.renderRankingItem(item);
             })}

              </List>
            </WingBlank>
            )}
        </Flex.Item>

      </Flex>
    );
  }
}

