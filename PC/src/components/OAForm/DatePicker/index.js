import React, { PureComponent } from 'react';
import {
  DatePicker,
} from 'antd';
import moment from 'moment';
import './index.less';

export default class DataPicker extends PureComponent {
  render() {
    const { value, onChange, format } = this.props;
    const momentValue = value ? { value: moment(value, format || 'YYYY-MM-DD') } : null;
    return (
      <DatePicker
        {...this.props}
        {...momentValue}
        dateRender={(current, today) => {
          let className = 'ant-calendar-date';
          if (current.date() === today.date()) {
            className = 'ant-calendar-date customer-today';
          }
          return (
            <div className={className}>
              {current.date()}
            </div>
          );
        }}
        onChange={(_, dateString) => {
          onChange(dateString);
        }}
      />
    );
  }
}

