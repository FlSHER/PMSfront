import React from 'react';
import {
  connect,
} from 'dva';
import moment from 'moment';
import { Flex } from 'antd-mobile';
import { Point } from '../../../common/ListView/index';
import { CheckBoxs } from '../../../components/index';
import ModalFilters from '../../../components/ModalFilters';
import { pointSource } from '../../../utils/convert';
import { getUrlParams, getUrlString, parseParamsToUrl, doConditionValue, parseParams } from '../../../utils/util';
import style from '../index.less';

const sortList = [
  { name: '生效时间升序', value: 'changed_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '生效时间降序', value: 'changed_at-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: '记录时间升序', value: 'created_at-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: '记录时间降序', value: 'created_at-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'A分升序', value: 'point_a-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'A分降序', value: 'point_a_-desc', icon: import('../../../assets/filter/desc.svg') },
  { name: 'B分升序', value: 'point_b_-asc', icon: import('../../../assets/filter/asc.svg') },
  { name: 'B分降序', value: 'point_b_-desc', icon: import('../../../assets/filter/desc.svg') },
];

const type = 'point';

const filterColumns = [
  {
    title: '分值类型',
    name: 'point_a',
    type: 'range',
    addonBefore: (
      <CheckBoxs
        itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
        option={[{ name: 'A分', value: 'point_a' }]}
      />
    ),
    min: 1,
    max: 10,
  },
  {
    name: 'point_b',
    type: 'range',
    addonBefore: (
      <CheckBoxs
        itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
        option={[{ name: 'B分', value: 'point_a' }]}
      />
    ),
    min: 1,
    max: 10,
  },
  {
    name: 'source_id',
    type: 'checkBox',
    title: '类别',
    multiple: true,
    options: pointSource,
  },
  {
    title: '记录时间',
    name: 'created_at',
    type: 'timerange',
    min: null,
    max: moment(new Date()).format('YYYY-MM-DD'),
  },
  {
    title: '生效时间',
    name: 'changed_at',
    type: 'timerange',
    min: null,
    max: moment(new Date()).format('YYYY-MM-DD'),
  },
];

@connect(({ point, alltabs }) => ({
  pointList: point.pointList,
  allTabs: alltabs.tabs,
}))
export default class PointList2 extends React.Component {
  state = {
    visible: false,
    model: 'filters',
    page: 1,
    totalpage: 10,
  }

  componentWillMount() {
    const { pointList } = this.props;
    if (pointList[type] && pointList[type].page !== 1) {
      this.currentFilter();
      return;
    }
    this.fetchDataSource({});
  }

  componentWillReceiveProps(props) {
    const { location: { search }, pointList } = props;
    this.currentFilter();
    if (JSON.stringify(this.props.pointList[type]) !== JSON.stringify(pointList[type])) {
      const page = pointList[type] ? pointList[type].page : 1;
      const totalpage = pointList[type] ? pointList[type].totalpage : 10;
      this.setState({
        totalpage,
        page,
      });
    }
    if (this.props.location.search !== search) {
      if (pointList[type] && pointList[type].page !== 1) {
        return;
      }
      this.fetchDataSource({});
    }
  }

  onPageChange = () => {
    const { pointList } = this.props;
    const currentData = pointList;
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
        type,
        value: 'sort=changed_at-desc',
      },
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
    const { dispatch, allTabs, location } = this.props;
    const currentTab = allTabs[type];
    this.sorter = (params && params.sort) || 'created_at-desc';
    const currentParams = parseParams(currentTab);
    const newParams = { page: 1, pagesize: 10, ...currentParams, ...params };
    const staffSn = getUrlParams(location.search).staff_sn;
    if (staffSn) newParams.staff_sn = staffSn;
    const urlparams = parseParamsToUrl(newParams);
    dispatch({
      type: 'alltabs/saveKey',
      payload: {
        type,
        value: urlparams,
      },
    });
    dispatch({
      type: 'point/getPointLog2',
      payload: urlparams,
    });
  }

  toLookDetail = (item) => {
    this.props.history.push(`/point_detail/${item.id}`);
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
          onClick={() => {
            this.onShortcut(value);
          }}
        />
      </div>
    );
    return extra;
  }

  render() {
    const { pointList } = this.props;
    const { data } = pointList;
    const { page, totalpage } = this.state;
    let [sortItem] = sortList.filter(item => item.value === this.sorter);
    if (!sortItem) {
      [sortItem] = sortList;
    }
    const activeStyle = Object.keys(this.filters || {}).length ? style.active : null;
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
              top="1.17333rem"
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
          <Point
            dataSource={data || []}
            handleClick={this.toLookDetail}
            onRefresh={this.onRefresh}
            onPageChange={this.onPageChange}
            page={page || 1}
            totalpage={totalpage || 10}
          />
        </Flex.Item>

      </Flex>
    );
  }
}

