
import React from 'react';
import ListFilter from '../Filter/ListFilter';
import { makerFilters } from '../../utils/util';
import InputRange from './inputRange';
// import style from './index.less';

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
    this.fetchFilters();
  }

  // componentWillReceiveProps(nextProps) {
  //   const { filters, sorters } = nextProps;
  //   if (
  //     JSON.stringify(this.props.filters) !== JSON.stringify(filters)
  //     ||
  //     JSON.stringify(this.props.sorters) !== JSON.stringify(sorters)
  //   ) {
  //     this.setState({ filters: { ...filters }, sorters: { ...sorters } }, () => {
  //       this.fetchFilters();
  //     });
  //   }
  // }


  fetchFilters = () => {
    const { filters, sorters } = this.state;
    const { fetchDataSource } = this.props;
    let params = {
      sorters,
      filters,
    };
    params = makerFilters(params);
    console.log(params);
    fetchDataSource(params);
  }

  handleOnChange = (key, value) => {
    const { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        [key]: value,
      },
    });
  }

  makeRangeFilter = ({ name, min, max }) => {
    const rangaValue = this.state.filters[name];
    return (
      <InputRange
        value={rangaValue || {}}
        min={min}
        max={max}
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
      case 'time':
        component = this.makeTimeFilter(item);
        break;
      default:
        break;
    }

    return (
      <div key={item.name}>
        <label>{item.label}</label>
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
        onOk={this.fetchFilters}
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
      name: 'point_a',
      type: 'range',
      min: 1,
      max: 10,
    },
    {
      name: 'point_b',
      type: 'range',
      min: 1,
      max: 10,
    },
  ],
  sorters: {},
  filters: { point_a: { min: 1, max: 10 }, point_b: { min: 1, max: 10 } },
  fetchDataSource: () => { },
};
export default ModalFilters;
