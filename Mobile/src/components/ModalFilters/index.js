import React from 'react';
import { CheckBoxs } from '../../components/index';
import ListFilter from '../Filter/ListFilter';
import { makerFilters } from '../../utils/util';
import InputRange from './InputRange';
import CheckBox from './CheckBox';
import style from './index.less';

class ModalFilters extends React.Component {
  constructor(props) {
    super(props);
    const { filters, sorters } = props;
    this.state = {
      filters: filters || {},
      sorters: sorters || {},
    };
  }

  componentWillMount() {
    this.fetchFilters({});
  }

  fetchFilters = (params) => {
    const { filters, sorters } = this.state;
    const { fetchDataSource } = this.props;
    let newParams = {
      sorters,
      filters,
    };
    newParams = makerFilters(params || newParams);
    console.log(newParams);
    fetchDataSource(newParams);
  }

  handleOnChange = (key, value) => {
    const { filters } = this.state;
    console.log(filters);
    this.setState({
      filters: {
        ...filters,
        [key]: value,
      },
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
        onChange={value => this.handleOnChange(name, value)}
      />
    );
  }

  makeCheckFilter = (props) => {
    const { name } = props;
    const rangaValue = this.state.filters[name];
    return (
      <CheckBox
        {...props}
        value={rangaValue}
        onChange={value => this.handleOnChange(name, value)}
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

  renderFiltersComponent = () => {
    const { filterColumns } = this.props;
    const renderFilter = filterColumns.map((item) => {
      return this.makeFilterComponent(item);
    });
    return renderFilter;
  }

  render() {
    return (
      <ListFilter
        onOk={() => this.fetchFilters()}
        filterKey="filterModal"
        iconStyle={{ width: '0.533rem', height: '0.533rem' }}
        visible={this.props.visible}
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
}

ModalFilters.defaultProps = {
  filterColumns: [
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
          option={[{ name: 'B分', value: 'point_b' }]}
        />
      ),
      min: 1,
      max: 10,
    },
    {
      name: 'source_id',
      type: 'checkBox',
      title: '分值来源',
      multiple: false,
      options: [
        {
          label: '系统分', value: 0,
        },
        {
          label: '固定分', value: 1,
        },
        {
          label: '奖扣分', value: 2,
        },
        {
          label: '任务分', value: 3,
        },
        {
          label: '考勤分', value: 4,
        },
        {
          label: '日志分', value: 5,
        },
      ],
    },
  ],
  sorters: {},
  filters: { point_a: { min: 1, max: 10 }, point_b: { min: 1, max: 10 } },
  fetchDataSource: () => { },
};
export default ModalFilters;
