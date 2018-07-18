import React, { PureComponent } from 'react';
import {
  DatePicker,
} from 'antd';
import moment from 'moment';
import './index.less';

export default class DataPicker extends PureComponent {
  render() {
    const { value, onChange, format } = this.props;
    const momentValue = value && value.length ? { value: moment(value, format || 'YYYY-MM-DD') } : {};
    return (
      <DatePicker
        {...this.props}
        {...momentValue}
        onChange={(_, dateString) => {
          onChange(dateString);
        }}
      />
    );
  }
}

