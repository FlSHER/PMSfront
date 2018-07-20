import React from 'react';
import { Input, Select, Button, Spin } from 'antd';
// import { dontInitialValue, makeInitialValue } from '../../utils/utils';


const { Option } = Select;
const InputGroup = Input.Group;

const defaultProps = {
  fetchDataSource: () => { },
  dataSource: [],
  loading: false,
  afterClick: null,
  renderOption: null,
};
export default class SearchSelect extends React.Component {
  state = {
    value: '',
  }

  handleSearch = (value) => {
    // fetch(value, data => this.setState({ data }));
    if (this.setInterval) {
      clearInterval(this.setInterval);
    }
    this.setInterval = setInterval(this.fetcSelectDataSource(value), 500);
  }

  fetcSelectDataSource = (value) => {
    return () => {
      clearInterval(this.setInterval);
      this.setState({ value }, () => {
        const { fetchDataSource } = this.props;
        fetchDataSource(value);
      });
    };
  }

  handleChange = (value) => {
    console.log(value);
    this.setState({ value });
  }

  makeSelectProps = () => {
    const { value } = this.state;
    const response = {
      value,
      onSearch: this.handleSearch,
      onChange: this.handleChange,
      notFoundContent: null,
      showArrow: false,
      filterOption: false,
      defaultActiveFirstOption: false,
      showSearch: true,
      getPopupContainer: () => (document.getElementById('selectDom')),
      ...this.props,
    };
    if (response.showSearch) {
      response.notFoundContent = response.loading ? <Spin size="small" /> : null;
    }
    Object.keys(defaultProps).forEach((key) => {
      delete response[key];
    });
    return response;
  }

  renderOption = () => {
    const { dataSource, renderOption } = this.props;
    return dataSource.map((item, index) => {
      return renderOption ? renderOption(item, index) : (
        <Option key={item.value}>{item.text}</Option>
      );
    });
  }

  render() {
    const { style, afterClick } = this.props;
    return (
      <div style={{ position: 'relative', ...style }}>
        <InputGroup compact style={{ display: 'flex' }}>
          <Select
            {...this.makeSelectProps()}
            style={{ flexGrow: 1 }}
          >
            {this.renderOption()}
          </Select>
          {afterClick && <Button type="primary" icon="search" onClick={afterClick} />}
        </InputGroup>
      </div>
    );
  }
}
SearchSelect.defaultProps = defaultProps;
