import React from 'react';
import { Input, Select, Button, Spin } from 'antd';
import { dontInitialValue, makeInitialValue } from '../../utils/utils';


const { Option } = Select;
const InputGroup = Input.Group;

const defaultProps = {
  fetchDataSource: () => { },
  onChange: () => { },
  valueIndex: 'id',
  valueText: 'name',
  valueOBJ: {},
  dataSource: [],
  selectedData: [],
  loading: false,
  afterClick: null,
  renderOption: null,
};
export default class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    const { valueIndex } = props;
    let { valueOBJ } = props;
    valueOBJ = makeInitialValue(props.name, valueOBJ || {});
    const newValue = valueOBJ[valueIndex];
    this.state = {
      value: newValue || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { name, valueIndex } = nextProps;
    let { valueOBJ } = nextProps;
    if (JSON.stringify(valueOBJ) !== JSON.stringify(this.props.valueOBJ)) {
      valueOBJ = makeInitialValue(name, valueOBJ);
      const newValue = valueOBJ[valueIndex] || '';
      this.setState({ value: newValue });
    }
  }

  onChange = (value) => {
    const { onChange, name, valueOBJ } = this.props;
    if (JSON.stringify(valueOBJ) === JSON.stringify(value)) return;
    let newValue = value;
    if (Object.keys(value).length) {
      newValue = dontInitialValue(name, value);
    }
    onChange(newValue);
  }

  handleSearch = (value) => {
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
    this.setInterval = setInterval(this.fetcSelectDataSource(value), 500);
  }

  fetcSelectDataSource = (value) => {
    return () => {
      clearInterval(this.setInterval);
      this.setState({ value }, () => {
        const { fetchDataSource, onChange } = this.props;
        fetchDataSource(value);
        onChange({});
      });
    };
  }

  handleChange = (value, option) => {
    this.setState({ value }, () => this.onChange(option.props.data));
  }

  makeSelectProps = () => {
    const { value } = this.state;
    const response = {
      onSearch: this.handleSearch,
      onChange: this.handleChange,
      notFoundContent: null,
      showArrow: false,
      filterOption: false,
      defaultActiveFirstOption: false,
      showSearch: true,
      getPopupContainer: () => (document.getElementById('selectDom')),
      ...this.props,
      value,
    };
    if (response.showSearch) {
      response.notFoundContent = response.loading ? <Spin size="small" /> : null;
    }
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    response.onChange = this.handleChange;
    return response;
  }

  renderOption = () => {
    const { dataSource, renderOption, valueIndex, valueText } = this.props;
    return dataSource.map((item, index) => {
      return renderOption ? renderOption(item, index) : (
        <Option
          key={item[valueIndex]}
          value={item[valueIndex]}
          data={item}
        >
          {item[valueText]}
        </Option>
      );
    });
  }

  renderHiddenOption = () => {
    const { selectedData, valueIndex, valueText } = this.props;
    return selectedData.map((item, index) => {
      const key = `selected${item[valueIndex]}-${index}`;
      return (
        <Option
          style={{ display: 'none' }}
          key={key}
          value={item[valueIndex]}
          data={item}
        >
          {item[valueText]}
        </Option>
      );
    });
  }

  render() {
    const { style, afterClick, dataSource } = this.props;

    return (
      <div style={{ position: 'relative', ...style }}>
        <InputGroup compact style={{ display: 'flex' }}>
          <Select
            {...this.makeSelectProps()}
            style={{ flexGrow: 1 }}
          >
            {dataSource.length && this.renderOption()}
            {!dataSource.length && this.renderHiddenOption()}
          </Select>
          {afterClick && <Button type="primary" icon="search" onClick={afterClick} />}
        </InputGroup>
      </div>
    );
  }
}
SearchSelect.defaultProps = defaultProps;
