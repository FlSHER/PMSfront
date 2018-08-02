import React, { PureComponent } from 'react';
import {
  DatePicker,
} from 'antd';
import moment from 'moment';

// import styles from './index.less';

export default class Picker extends PureComponent {
  makeProps = () => {
    const { value, format } = this.props;
    const momentValue = value && value.length ? { defaultValue: moment(value, format || 'YYYY-MM-DD') } : undefined;
    const temp = { ...this.props };
    delete temp.value;
    const response = {
      ...temp,
      ...momentValue,
    };
    return response;
  }

  render() {
    const { onChange } = this.props;
    return (
      <DatePicker
        getCalendarContainer={trigger => (trigger)}
        {...this.makeProps()}
        onChange={(_, dateString) => {
          onChange(dateString);
        }}
      />
    );
  }
}
Picker.defaultProps = {
  onChange: () => { },
};

