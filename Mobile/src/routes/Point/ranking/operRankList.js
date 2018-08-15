import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, DatePicker } from 'antd-mobile';
import moment from 'moment';
import { Ranking } from '../../../common/ListView';
import { TimeRange } from '../../../components/General';
import { userStorage, parseParamsToUrl, getUrlParams } from '../../../utils/util';
import { ListSort } from '../../../components/index';
import style from '../index.less';

// const sortList = [
//   { name: '默认排序', value: 'created_at-asc',
// icon: import('../../../assets/filter/default_sort.svg') },
//   { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
//   { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
//   { name: 'A分升序', value: 'point_a-asc', icon: import('../../../assets/filter/asc.svg') },
//   { name: 'A分降序', value: 'point_a_-desc', icon: import('../../../assets/filter/desc.svg') },
//   { name: 'B分升序', value: 'point_b_-asc', icon: import('../../../assets/filter/asc.svg') },
//   { name: 'B分降序', value: 'point_b_-desc', icon: import('../../../assets/filter/desc.svg') },
// ];
const stageArr = [
  'month', 'stage', 'total',
];
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
  loading,
  optRankingDetails: ranking.optRankingDetails,
  group: ranking.group,
}))
export default class PointRanking extends React.Component {
  state = {
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
      offsetBottom: 0,
    },
    // params: {
    //   stage: 'month',
    //   datetime: moment(new Date()).format('YYYY-MM-DD'),
    //   group_id: '',
    //   start_at: '',
    //   end_at: '',
    // },
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    this.urlParams = getUrlParams(location.search);
    this.initStage();
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
      const { stage } = this.urlParams;
      this[stage] = search;
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

  setInitValue = (tab) => {
    const lastMonth = moment().subtract(1, 'months');
    const maxMonth = moment().subtract(6, 'months');
    const urlParams = {};
    if (tab === 'stage') {
      urlParams.start_at = moment(maxMonth).format('YYYY-MM');
      urlParams.end_at = moment(lastMonth).format('YYYY-MM');
    }
    if (tab === 'month') {
      urlParams.datetime = moment(maxMonth).format('YYYY-MM');
    }
    const url = parseParamsToUrl(urlParams);
    const addUrl = url ? `&${url}` : '';
    return `?group_id=${this.urlParams.group_id}&stage=${tab}${addUrl}`;
  }

  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }

  initStage = () => {
    const { location: { search } } = this.props;
    const { stage } = this.urlParams;
    stageArr.forEach((item) => {
      if (stage === item) {
        this[item] = search;
      } else {
        this[item] = this.setInitValue(item);
      }
    });
  }

  selFilter = (feild) => { // 筛选
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal[feild] = !newModal[feild];
    this.setNewState('modal', newModal);
  }

  tabChange = (item) => {
    const { history } = this.props;
    const stage = item.value;
    const params = this[stage];
    const url = `/opt_ranking${params}`;
    history.replace(url);
  }

  fetchRanking = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ranking/getStatiRanking',
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
    let url = '/opt_ranking';
    const params = this.urlParamsUnicode(this.urlParams);
    url += params ? `?${params}` : '';
    this.props.history.replace(url);
  }

  toPointList = (item) => {
    const { history } = this.props;
    const stageParams = getUrlParams(this.month);
    const { datetime } = stageParams;
    const datetimeUrl = datetime || moment(new Date()).format('YYYY-MM');
    history.push(`/point_statistic?staff_sn=${item.staff_sn}&datetime=${datetimeUrl}`);
  }

  render() {
    const { optRankingDetails, loading, group } = this.props;
    const current = optRankingDetails[JSON.stringify(this.urlParams)] || {};
    const statisGroup = group.statis_group || [];
    const { list } = current || {};
    const params = this.urlParams;
    const { stage = 'month' } = params;
    const { offsetBottom } = this.state;
    const [sortItem] = statisGroup.filter(item => item.id.toString() === this.urlParams.group_id);
    const lastMonth = moment().subtract(1, 'months');
    const startAt = params.stage ?
      (params.start_at ? `${params.start_at}/1` : '2018/7/1').replace(/-/g, '/')
      : '2018/7/1';
    const endAt = params.stage ?
      (params.end_at ?
        (`${params.end_at}/1`).replace(/-/g, '/') : moment(lastMonth).format('YYYY/MM/DD')) : moment(lastMonth).format('YYYY/MM/DD');
    const range = {
      max: new Date(lastMonth),
      min: new Date('2018/7/1'),
    };
    const iosTime = params.datetime ? (`${params.datetime}/1`).replace(/-/g, '/') : moment(new Date()).format('YYYY/MM/DD');

    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <div className={[style.filter_con, style.tab].join(' ')} >
            <Flex
              justify="between"
            >
              <Flex.Item style={{ textAlign: 'center' }}>
                <div
                  className={[style.filter, style.cancelbg].join(' ')}
                  onClick={() => this.selFilter('sortModal')}
                // style={{ background: 'none' }}
                >
                  <span>{sortItem ? sortItem.name : '选择部门'}</span>
                </div>
              </Flex.Item>
              <Flex.Item style={{ textAlign: 'center' }}>
                {stage === 'month' && (
                <DatePicker
                  value={moment(params.datetime).isValid() ? new Date(iosTime) : '请选择时间'}
                  mode="month"
                  maxDate={new Date()}
                  minDate={new Date('2018/7/1')}
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
                  range={range}
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
              top="1.17333rem"
              visible={this.state.modal.sortModal}
              onCancel={this.onCancel}
              filterKey="sortModal"
            >
              {statisGroup.map((item, i) => {
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
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px' }}> 排名详情</p>
              {current.calculated_at ?
                (
                  <span style={{ fontSize: '12px', color: 'rgb(24, 116, 208)' }}>
                    结算日期：{current.calculated_at}
                  </span>
                )
                : null}
            </div>
          </WingBlank>
        </Flex.Item>
        <Flex.Item
          {...(loading.global && { style: { display: 'none' } })}
          className={[style.content, style.removeBg].join(' ')}
        >
          <WingBlank>
            <Ranking
              dataSource={list || []}
              offsetBottom={offsetBottom}
              handleClick={this.toPointList}
              onRefresh={this.onRefresh}
            />
          </WingBlank>
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

