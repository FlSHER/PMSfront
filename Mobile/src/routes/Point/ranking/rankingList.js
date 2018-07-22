import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, DatePicker } from 'antd-mobile';
import moment from 'moment';
import { TimeRange } from '../../../components/General';
import { Ranking } from '../../../common/ListView';
import nothing from '../../../assets/nothing.png';
import { userStorage, getUrlParams, scrollToAnchor } from '../../../utils/util';
import { ListSort, Nothing } from '../../../components/index';
import style from '../index.less';

const tabs = [
  {
    value: 'month',
    name: '月度排名',
  },
  {
    value: 'stage',
    name: '阶段排名',
  },
  {
    value: 'total',
    name: '累计排名',
  },
];
@connect(({ ranking, loading }) => ({
  ranking: ranking.ranking,
  loading,
  group: ranking.group,
}))
export default class PointRanking extends React.Component {
  state = {
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
      offsetBottom: 0,
    },
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    this.urlParams = getUrlParams(location.search);
    this.month = this.setInitValue('month');
    this.stage = this.setInitValue('stage');
    this.total = this.setInitValue('total');
    this.fetchRanking(this.urlParams);
    dispatch({
      type: 'ranking/getAuthorityGroup',
    });
    this.userInfo = userStorage('userInfo');
  }

  componentDidMount() {
    if (this.ptr) {
      const htmlDom = ReactDOM.findDOMNode(this.ptr);
      const offsetBottom = htmlDom.offsetHeight;
      setTimeout(() => this.setState({
        offsetBottom,
      }), 0);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: { search } } = nextProps;
    if (search !== this.props.location.search) {
      this.urlParams = getUrlParams(search);
      this.fetchRanking(this.urlParams);
    }
  }

  onCancel = (e, feild) => {
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = false;
    this.setNewState('modal', newModal);
  }

  onRefresh = () => {
    this.fetchRanking(this.urlParams);
  }

  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }

  setInitValue = (tab) => {
    return `?group_id=${this.urlParams.group_id}&stage=${tab}`;
  }

  selFilter = (feild) => { // 筛选
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = !newModal[feild];
    this.setNewState('modal', newModal);
  }

  fetchRanking = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ranking/getRanking',
      payload: params,
    });
  }

  urlParamsUnicode = (params) => {
    const url = [];
    Object.keys(params).forEach((item) => {
      if (params[item]) {
        url.push(`${item}=${params[item]}`);
      }
    });
    return url.join('&');
  }

  sortReasult = (filters) => {
    this.urlParams = {
      ...this.urlParams,
      ...filters,
    };
    let url = '/ranking';
    const params = this.urlParamsUnicode(this.urlParams);
    url += params ? `?${params}` : '';
    this[this.urlParams.stage || 'month'] = params ? `?${params}` : '';
    this.props.history.replace(url);
  }

  tabChange = (item) => {
    const { history } = this.props;
    const stage = item.value;
    const params = this[stage];
    const url = `/ranking${params}`;
    history.replace(url);
  }

  toPointList = (item) => {
    const { history } = this.props;
    history.push(`/point_statistic?staff_sn=${item.staff_sn}`);
  }

  render() {
    const { ranking, loading, group } = this.props;
    const authGroup = group.auth_group || [];
    const { list, user } = ranking;
    const { userInfo } = this;
    const params = this.urlParams;
    const { stage = 'month' } = params;
    const { offsetBottom } = this.state;
    const [sortItem] = authGroup.filter(item => item.id.toString() === this.urlParams.group_id);
    const endAt = new Date();
    const startAt = new Date('2018/7/1');
    const iosTime = (params.datetime || '').replace(/-/g, '/');
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={[style.filter_con, style.tab].join(' ')} >
            <Flex
              justify="between"
              // style={{ padding: '0 1.68rem' }}
            >
              <Flex.Item style={{ textAlign: 'center' }}>
                <div
                  className={[style.dosort, style.cancelbg].join(' ')}
                  onClick={() => this.selFilter('sortModal')}
                // style={{ background: 'none' }}
                >
                  <span >{sortItem ? sortItem.name : '选择部门'}</span>
                </div>
              </Flex.Item>
              <Flex.Item style={{ textAlign: 'center' }}>
                {stage === 'month' && (
                <DatePicker
                  value={moment(params.datetime).isValid() ? new Date(iosTime) : '请选择时间'}
                  mode="month"
                  maxDate={new Date()}
                  onChange={(date) => {
                  const time = moment(date).format('YYYY-MM');
                  if (time !== this.urlParams.datetime) {
                    this.sortReasult({ datetime: time });
                  }
                }
                }
                >
                  <div
                    className={[style.filter, style.cancelbg].join(' ')}
                  ><span style={{ borderRight: 'none' }}>{params.datetime ? params.datetime : moment(new Date()).format('YYYY-MM')}</span>
                  </div>
                </DatePicker>
                )}
                {stage === 'stage' && (
                <TimeRange
                  distance={6}
                  value={{ min: startAt, max: endAt }}
                  onChange={(start, end) => this.sortReasult({ start_at: start, end_at: end })}
                />
                )}
                {stage === 'total' && <div><span style={{ borderRight: 'none', color: 'rgb(155, 155, 155)' }}>累计</span></div>}
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
                overflow: 'auto',
                background: 'rgba(0, 0, 0, 0.1)',
              }}
              visible={this.state.modal.sortModal}
              onCancel={this.onCancel}
              filterKey="sortModal"
            >
              {authGroup.map((item, i) => {
                const idx = i;
                return (
                  <div
                    className={style.sort_item}
                    key={idx}
                    onClick={(e) => {
                      this.onCancel(e, 'sortModal');
                      if (item.id.toString() !== this.urlParams.group_id) {
                        this.sortReasult({ group_id: item.id });
                      }
                    }}
                  >{item.name}
                  </div>
                );
              })}
            </ListSort>
          </div>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px' }}>我的排名</p>
              <span
                style={{ fontSize: '12px', color: 'rgb(24, 116, 208)' }}
                onClick={() => scrollToAnchor('my')}
              >在列表中查看
              </span>
            </div>
            <Flex
              justify="between"
              style={{
                height: '50px',
                padding: '0 0.48rem',
                borderBottom: '1px solid rgb(250,250,250)',
                background: '#fff',
              }}
            >
              <Flex.Item
                style={{
                  fontSize: '16px',
                }}
              >
                {user ? user.rank : ''}&nbsp;&nbsp;{userInfo.realname}
              </Flex.Item>
              <Flex.Item
                style={{
                  color: 'rgb(155,155,155)',
                  fontSize: '16px',
                  textAlign: 'right',
                }}
              >
                {user ? user.total : ''}
              </Flex.Item>
            </Flex>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px' }}> 排名详情</p>
              {ranking.calculated_at ?
                (
                  <span style={{ fontSize: '12px' }}>
                    结算时间：{ranking.calculated_at}
                  </span>
                )
                : null}
            </div>
          </WingBlank>
        </Flex.Item>
        <Flex.Item
          {...(loading.global && { style: { display: 'none' } })}
          className={style.content}
        >
          {list && !list.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
              <Nothing src={nothing} />
            </div>) : (
              <WingBlank>
                <Ranking
                  dataSource={list || []}
                  offsetBottom={offsetBottom}
                  handleClick={this.toPointList}
                  onRefresh={this.onRefresh}
                />
              </WingBlank>
            )}
        </Flex.Item>
        <Flex.Item
          className={style.footer}
          ref={(e) => { this.ptr = e; }}
        >
          <Flex
            align="center"
            style={{ height: '50px' }}
          >
            {tabs.map(item => (
              <Flex.Item
                key={item.value}
                className={[style.item, (params.stage || 'month')
                  === item.value ? style.active : null].join(' ')}
                onClick={() => this.tabChange(item)}
              ><span>{item.name}</span>
              </Flex.Item>
            ))}
          </Flex>
        </Flex.Item>
      </Flex>
    );
  }
}

