import React from 'react';
import {
  connect,
} from 'dva';
import moment from 'moment';
import { WingBlank, Flex, InputItem, DatePicker } from 'antd-mobile';
// import defaultAvatar from '../../../assets/default_avatar.png';
// import style from '../index.less';
// import styles from '../../common.less';
import { Point } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs, ListSort } from '../../../components/index';
import style from '../index.less';
// import shortcut from '../../../assets/shortcuts.png';

const sortList = [
  { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  { name: '时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'A分升序', value: 'point_a-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'A分降序', value: 'point_a_-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'B分升序', value: 'point_b_-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'B分降序', value: 'point_b_-desc', icon: import('../../../assets/filter/desc.svg') },
];

const pointSource = [
  {
    name: '系统分', value: 0,
  },
  {
    name: '固定分', value: 1,
  },
  {
    name: '奖扣分', value: 2,
  },
  {
    name: '任务分', value: 3,
  },
  {
    name: '考勤分', value: 4,
  },
  {
    name: '日志分', value: 5,
  },
];

@connect(({ point }) => ({
  pointList: point.pointList,
}))
export default class PointList extends React.Component {
  state = {
    filter: {// 筛选结果
      point_a: {
        selectd: 'point_a',
        range: {
          min: '',
          max: '',
        },
      },
      point_b: {
        selectd: 'point_b',
        range: {
          min: '',
          max: '',
        },
      },
      source_id: [],
      date: {
        min: '',
        max: '',
      },
      created_at: {
        min: '',
        max: '',
      },
    },
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
    },
    sortItem: { name: '默认排序', value: 'created_at-asc', icon: import('../../../assets/filter/default_sort.svg') },
  }
  componentWillMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'point/getPointLog',
    //   payload: {
    //     pagesize: 10,
    //     page: 1,
    //   },
    // });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  onRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/getPointLog',
      payload: {
        pagesize: 10,
        page: 1,
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
    this.setNewState('filter', {});
  }
  onFilterOk = () => {
    const { sortItem } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'buckle/getLogsList',
      payload: {
        pagesize: 10,
        page: 1,
        sort: sortItem.value,
        filters: this.dealFilter(),
      },
    });
    this.onCancel('', 'filterModal');
  }
  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }

  dealFilter = () => {
    const { filter } = this.state;
    const search = {};
    for (const key in filter) {
      if (key !== undefined) {
        if (key === 'point_a' || key === 'point_b') {
          search[key] = filter[key].range;
        }
        if (key === 'source_id') {
          search[key] = {
            in: filter[key] };
        }
        if (key === 'date' || key === 'created_at') {
          search[key] = filter[key];
        }
      }
    }
    return search;
  }
  sortReasult = (item) => {
    const { dispatch } = this.props;
    const { modal } = this.state;
    const newModal = { ...modal };
    newModal.sortModal = false;
    this.setState({
      modal: { ...newModal },
      sortItem: item,
    }, () => {
      dispatch({
        type: 'point/getPointLog',
        payload: {
          pagesize: 10,
          page: 1,
          sort: item.value,
        },
      });
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
    const temp = newFilter[key].selectd === v ? '' : v;
    newFilter[key].selectd = temp;
    this.setNewState('filter', newFilter);
  }
  timeChange = (date, key, range) => {
    const { filter } = this.state;
    const newFilter = { ...filter };
    newFilter[key][range] = date;
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
    this.setNewState('checkState', item);
  }
  toLookDetail = () => {
    this.props.history.push('/point_detail/1');
  }
  rangeChange = (v, key, range) => {
    if (v && v !== '-' && !/^-?\d+$/.test(v)) {
      return;
    }
    const { filter } = this.state;
    const newFilter = { ...filter };
    (newFilter[key].range)[range] = v;
    this.setNewState('filter', newFilter);
  }
  render() {
    const { pointList } = this.props;
    const { data } = pointList;
    const { page, totalpage } = pointList;
    const { filter } = this.state;
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
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
        </Flex.Item>
        <Flex.Item className={style.content}>
          <WingBlank>
            <Point
              dataSource={data || []}
              handleClick={this.toLookDetail}
              onRefresh={this.onRefresh}
              onPageChange={this.onPageChange}
              page={page || 1}
              totalpage={totalpage || 10}
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
          <div
            className={[style.filter_item, style.range].join(' ')}
            style={{ paddingBottom: '0.48rem' }}
          >
            <div className={style.title}>分值类型</div>
            <Flex align="center">
              <CheckBoxs
                itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
                option={[{ name: 'A分', value: 'point_a' }]}
                checkStatus={(i, v) => this.checkItem(i, v, 'point_a')}
                value={[filter.point_a.selectd]}
              />
              <InputItem
                value={filter.point_a.range.min}
                onChange={e => this.rangeChange(e, 'point_a', 'min')}
              /><span className={style.rg}>—</span><InputItem
                value={filter.point_a.range.max}
                onChange={e => this.rangeChange(e, 'point_a', 'max')}
              />
            </Flex>

          </div>
          <div
            className={[style.filter_item, style.range].join(' ')}
            style={{ paddingBottom: '0.48rem' }}
          >
            <div className={style.title}>分值类型</div>
            <Flex align="center">
              <CheckBoxs
                itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
                option={[{ name: 'B分', value: 'point_b' }]}
                checkStatus={(i, v) => this.checkItem(i, v, 'point_b')}
                value={[filter.point_b.selectd]}
              />
              <InputItem
                value={filter.point_b.range.min}
                onChange={e => this.rangeChange(e, 'point_b', 'min')}
              /><span className={style.rg}>—</span><InputItem
                value={filter.point_b.range.max}
                onChange={e => this.rangeChange(e, 'point_b', 'max')}
              />
            </Flex>

          </div>
          <div className={[style.filter_item].join(' ')} >
            <div className={style.title}>分值来源</div>
            <CheckBoxs
              option={pointSource}
              checkStatus={(i, v) => this.doMultiple(i, v, 'source_id')}
              value={filter.source_id}
            />
          </div>
          <div
            className={[style.filter_item].join(' ')}
            style={{ paddingBottom: '0.48rem' }}
          >
            <div className={style.title}>记录时间</div>
            <Flex>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'date', 'min')}
                >
                  <div className={style.some_time}>{filter.date.min ? moment(filter.date.min).format('YYYY-MM-DD') : ''}</div>
                </DatePicker>
              </Flex.Item>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'date', 'max')}
                >
                  <div className={style.some_time}>{filter.date.max ? moment(filter.date.max).format('YYYY-MM-DD') : ''}</div>
                </DatePicker>
              </Flex.Item>
            </Flex>
          </div>
          <div
            className={[style.filter_item].join(' ')}
            style={{ paddingBottom: '0.48rem' }}
          >
            <div className={style.title}>生效时间</div>
            <Flex>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'created_at', 'min')}
                >
                  <div className={style.some_time}>{filter.created_at.min ? moment(filter.created_at.min).format('YYYY-MM-DD') : ''}</div>
                </DatePicker>
              </Flex.Item>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'created_at', 'max')}
                >
                  <div className={style.some_time}>{filter.created_at.max ? moment(filter.created_at.max).format('YYYY-MM-DD') : ''}</div>
                </DatePicker>
              </Flex.Item>
            </Flex>
          </div>
        </ListFilter>
      </Flex>
    );
  }
}

