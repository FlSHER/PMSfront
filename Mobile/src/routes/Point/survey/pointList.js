import React from 'react';
import {
  connect,
} from 'dva';
import moment from 'moment';
import { WingBlank, Flex, InputItem, DatePicker } from 'antd-mobile';
import nothing from '../../../assets/nothing.png';
import { Point } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs, ListSort } from '../../../components/index';
import Nothing from '../../../components/Nothing/Nothing.js';
import { makerFilters, getUrlParams } from '../../../utils/util';
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
    filters: {// 筛选结果
      point_a: {
        min: '',
        max: '',
      },
      point_b: {
        min: '',
        max: '',
      },
      source_id: {
        in: [],
      },
      changed_at: {
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
    const { dispatch, location } = this.props;
    this.urlParams = getUrlParams(location.search);
    dispatch({
      type: 'point/getPointLog',
      payload: {
        pagesize: 10,
        page: 1,
        ...this.urlParams,
      },
    });
  }

  onRefresh = () => {
    const { dispatch } = this.props;
    const { filters, sortItem } = this.state;
    dispatch({
      type: 'point/getPointLog',
      payload: {
        pagesize: 10,
        page: 1,
        sort: sortItem.value,
        filters,
        ...this.urlParams,
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
    const { sortItem } = this.state;
    const { dispatch } = this.props;
    this.setState(
      { filters: {
        point_a: {
          min: '',
          max: '',
        },
        point_b: {
          min: '',
          max: '',
        },
        source_id: [],
        changed_at: {
          min: '',
          max: '',
        },
        created_at: {
          min: '',
          max: '',
        },
      } }, () => {
        dispatch({
          type: 'point/getPointLog',
          payload: {
            pagesize: 10,
            page: 1,
            ...this.urlParams,
            sort: sortItem.value,
          },
        });
      });
  }

  onFilterOk = () => {
    const { sortItem, filters } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'point/getPointLog',
      payload: {
        pagesize: 10,
        page: 1,
        sort: sortItem.value,
        ...this.urlParams,
        filters,
      },
    });
    this.onCancel('', 'filterModal');
  }

  onPageChange = () => {
    const { dispatch, pointList } = this.props;
    const { sortItem, filters } = this.state;
    dispatch({
      type: 'point/getPointLog',
      payload: {
        pagesize: 10,
        sort: sortItem.value,
        page: pointList.page + 1,
        ...this.urlParams,
        filters,
      },
    });
  }

  setNewState = (key, newValue) => {
    this.setState({
      [key]: newValue,
    });
  }

  sortReasult = (item) => {
    const { dispatch } = this.props;
    const { modal, filters } = this.state;
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
          ...this.urlParams,
          filters,
        },
      });
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
    const temp = newFilter[key].selectd === v ? '' : v;
    newFilter[key].selectd = temp;
    this.setNewState('filter', newFilter);
  }

  timeChange = (date, key, range) => {
    const { filters } = this.state;
    const newFilter = { ...filters };
    newFilter[key][range] = moment(date).format('YYYY/MM/DD');
    this.setNewState('filter', newFilter);
  }

  doMultiple = (i, v, key) => {
    const { filters } = this.state;
    const newFilter = { ...filters };
    let temp = [...(newFilter[key].in || [])];
    const isExist = temp.indexOf(v) !== -1;
    if (isExist) {
      temp = temp.filter(item => item !== v);
    } else {
      temp.push(v);
    }
    newFilter[key].in = [...temp];
    this.setNewState('filter', newFilter);
  }

  tabChange = (item) => {
    this.setNewState('checkState', item);
  }

  toLookDetail = (item) => {
    this.props.history.push(`/point_detail/${item.id}`);
  }

  rangeChange = (v, key, range) => {
    if (v && v !== '-' && !/^-?\d+$/.test(v)) {
      return;
    }
    const { filters } = this.state;
    const newFilter = { ...filters };
    newFilter[key][range] = v;
    this.setNewState('filter', newFilter);
  }

  render() {
    const { pointList } = this.props;
    const { data } = pointList;
    const { page, totalpage } = pointList;
    const { filters } = this.state;
    const isFilter = makerFilters({ filters }).filters;

    return (
      <Flex direction="column">
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
                  className={[style.filter, isFilter ? style.active : null].join(' ')}
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
          {data && !data.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
              <Nothing src={nothing} />
            </div>
          ) : (
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
          <div
            className={[style.filter_item, style.range].join(' ')}
            style={{ paddingBottom: '0.48rem' }}
          >
            <div className={style.title}>分值类型</div>
            <Flex align="center">
              <CheckBoxs
                itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
                option={[{ name: 'A分', value: 'point_a' }]}
                // checkStatus={(i, v) => this.checkItem(i, v, 'point_a')}
                // value={[filter.point_a.selectd]}
              />
              <InputItem
                value={filters.point_a.min}
                onChange={e => this.rangeChange(e, 'point_a', 'min')}
              /><span className={style.rg}>—</span><InputItem
                value={filters.point_a.max}
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
                // checkStatus={(i, v) => this.checkItem(i, v, 'point_b')}
                // value={[filter.point_b.selectd]}
              />
              <InputItem
                value={filters.point_b.min}
                onChange={e => this.rangeChange(e, 'point_b', 'min')}
              /><span className={style.rg}>—</span><InputItem
                value={filters.point_b.max}
                onChange={e => this.rangeChange(e, 'point_b', 'max')}
              />
            </Flex>

          </div>
          <div className={[style.filter_item].join(' ')} >
            <div className={style.title}>分值来源</div>
            <CheckBoxs
              option={pointSource}
              checkStatus={(i, v) => this.doMultiple(i, v, 'source_id')}
              value={filters.source_id.in}
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
                  onChange={date => this.timeChange(date, 'changed_at', 'min')}
                >
                  <div className={style.some_time}>{filters.changed_at.min}</div>
                </DatePicker>
              </Flex.Item>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'changed_at', 'max')}
                >
                  <div className={style.some_time}>{filters.changed_at.max}</div>
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
                  format="YYYY/MM/DD"
                  onChange={date => this.timeChange(date, 'created_at', 'min')}
                >
                  <div className={style.some_time}>{filters.created_at.min}</div>
                </DatePicker>
              </Flex.Item>
              <Flex.Item>
                <DatePicker
                  mode="date"
                  format="YYYY-MM-DD"
                  onChange={date => this.timeChange(date, 'created_at', 'max')}
                >
                  <div className={style.some_time}>{filters.created_at.max}</div>
                </DatePicker>
              </Flex.Item>
            </Flex>
          </div>
        </ListFilter>
      </Flex>
    );
  }
}

