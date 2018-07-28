import React from 'react';
import moment from 'moment';
import { CheckBoxs } from '../../components/index';
import ListFilter from '../Filter/ListFilter';
import { makerFilters } from '../../utils/util';
import InputRange from './InputRange';
import CheckBox from './CheckBox';
import PickerRange from './PickerRange';
import ModalSorter from './ModalSorter';
import style from './index.less';

class ModalFilters extends React.Component {
  constructor(props) {
    super(props);
    const { filters, sorter } = props;
    this.state = {
      filters: filters || {},
      sorter: sorter || {},
    };
  }

  componentWillMount() {
    // this.fetchFilters({});
  }

  fetchFilters = (params) => {
    const { sorter } = this.state;
    const filters = { ...this.state.filters };
    const { fetchDataSource, filterColumns } = this.props;
    const speciPams = [];
    let url = '';
    let newParams = {};
    Object.keys(filters).forEach((key) => {
      const [speciColumn] = filterColumns.filter(item => item.name === key);
      if (speciColumn && speciColumn.notusename) { // 不使用key
        const strValue = filters[key];
        delete filters[key];
        if (speciColumn.notbelong) { // 不放在filters里
          newParams[key] = strValue;
        } else {
          speciPams.push(strValue);
        }
      } else if (speciColumn && !speciColumn.notusename) { // 要使用key
        if (speciColumn.notbelong) { // 不放在filters里
          newParams[key] = filters[key];
          delete filters[key];
        }
      } else if (Array.isArray(filters[key])) {
        filters[key] = { in: filters[key] };
      }
    });
    newParams = {
      ...newParams,
      sort: sorter,
      filters,
    };
    url = speciPams.join(';');
    newParams = makerFilters(params || newParams);
    newParams.filters += url ? `;${url}` : '';
    // newParams.other;
    console.log('newParams', newParams);
    fetchDataSource(newParams);
  }

  handleFiltersOnChange = (key, value) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        [key]: value,
      },
    });
  }

  handlesorterOnChange = (sortValue) => {
    this.setState({
      sorter: sortValue,
    }, () => {
      this.fetchFilters();
    });
  }


  makeRangeFilter = (props) => {
    const { name, min, max } = props;
    const rangaValue = this.state.filters[name];
    return (
      <InputRange
        {...props}
        value={rangaValue}
        min={min}
        max={max}
        onChange={value => this.handleFiltersOnChange(name, value)}
      />
    );
  }

  makeCheckFilter = (props) => {
    const { name } = props;
    const keyValue = this.state.filters[name];
    const checkValue = keyValue.in;
    return (
      <CheckBox
        {...props}
        value={checkValue || []}
        onChange={value => this.handleFiltersOnChange(name, value)}
      />
    );
  }

  makeTimeRangeFilter = (props) => {
    const { name, max } = props;
    const rangaValue = this.state.filters[name];
    return (
      <PickerRange
        {...props}
        value={rangaValue}
        max={max}
        onChange={value => this.handleFiltersOnChange(name, value)}
      />
    );
  }

  makeFilterComponent = (item) => {
    let component;
    switch (item.type) {
      case 'range':
        component = this.makeRangeFilter(item);
        break;
      case 'checkBox':
        component = this.makeCheckFilter(item);
        break;
      case 'timerange':
        component = this.makeTimeRangeFilter(item);
        break;
      default:
        break;
    }

    if (!item.title) {
      return (
        <div
          key={item.name}
          className={[style.filter_item, style.range].join(' ')}
          style={{ paddingBottom: '0.48rem' }}
        >
          {component}
        </div>
      );
    }

    return (
      <div
        key={item.name}
        className={[style.filter_item, style.range].join(' ')}
        style={{ paddingBottom: '0.48rem' }}
      >
        <div className={style.title}>{item.title}</div>
        {component}
      </div>
    );
  }

  makeModalProps = () => {
    const { onCancel, visible } = this.props;
    const resopnse = {
      onCancel: () => onCancel(false),
      visible,
    };
    return resopnse;
  }

  renderFiltersComponent = () => {
    const { filterColumns } = this.props;
    const renderFilter = filterColumns.map((item) => {
      return this.makeFilterComponent(item);
    });
    return renderFilter;
  }

  renderFilters = () => {
    return (
      <ListFilter
        {...this.makeModalProps()}
        onOk={() => this.fetchFilters()}
        filterKey="filterModal"
        iconStyle={{ width: '0.533rem', height: '0.533rem' }}
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
        {this.renderFiltersComponent()}
      </ListFilter>
    );
  }


  render() {
    const { model, sorterData } = this.props;
    return (
      <React.Fragment>
        {model === 'filter' && this.renderFilters()}
        {model === 'sort' && (
          <ModalSorter
            {...this.makeModalProps()}
            data={sorterData}
            onChange={this.handlesorterOnChange}
          />
        )}
      </React.Fragment>
    );
  }
}

ModalFilters.defaultProps = {
  model: 'filter',
  filterColumns: [
    // {
    //   title: '记录时间',
    //   name: 'changed_at',
    //   type: 'timerange',
    //   min: null,
    //   max: moment(new Date()).format('YYYY-MM-DD'),
    // },
    // {
    //   title: '分值类型',
    //   name: 'point_a',
    //   type: 'range',
    //   addonBefore: (
    //     <CheckBoxs
    //       itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
    //       option={[{ name: 'A分', value: 'point_a' }]}
    //     />
    //   ),
    //   min: 1,
    //   max: 10,
    // },
    // {
    //   name: 'point_b',
    //   type: 'range',
    //   addonBefore: (
    //     <CheckBoxs
    //       itemStyle={{ marginBottom: 0, marginRight: '0.1333rem' }}
    //       option={[{ name: 'B分', value: 'point_b' }]}
    //     />
    //   ),
    //   min: 1,
    //   max: 10,
    // },
    // {
    //   name: 'source_id',
    //   type: 'checkBox',
    //   title: '分值来源',
    //   multiple: true,
    //   options: [
    //     {
    //       label: '系统分', value: 0,
    //     },
    //     {
    //       label: '固定分', value: 1,
    //     },
    //     {
    //       label: '奖扣分', value: 2,
    //     },
    //     {
    //       label: '任务分', value: 3,
    //     },
    //     {
    //       label: '考勤分', value: 4,
    //     },
    //     {
    //       label: '日志分', value: 5,
    //     },
    //   ],
    // },
  ],
  sorter: 'created_at-asc',
  sorterData: [
    { name: '默认排序', value: 'created_at-asc' },
    { name: '时间升序', value: 'created_at-asc' },
    { name: '时间降序', value: 'created_at-desc' },
    { name: 'A分升序', value: 'point_a-asc' },
    { name: 'A分降序', value: 'point_a_-desc' },
    { name: 'B分升序', value: 'point_b_-asc' },
    { name: 'B分降序', value: 'point_b_-desc' },
  ],
  filters: {
    // point_a: { min: 1, max: 10 }, point_b: { min: 1, max: 10 }
  },
  onCancel: () => { },
  fetchDataSource: () => { },
};
export default ModalFilters;
