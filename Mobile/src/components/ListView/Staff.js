import React, { Component } from 'react';
import { connect } from 'dva';
import ListView from './ListView';
import style from './index.less';

class Staff extends Component {
  render() {
    const { value, onClick, name, checked, multiple } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : null;
    return (
      <div className={style.action_item}>
        <div
          {...className}
          onClick={() => onClick(value)}
        >
          <span>{value[name]}</span>
        </div>
      </div>
    );
  }
}
Staff.defaultProps = {
  multiple: false,
};
const EnhanceDemo = ListView(Staff);
export default connect(({ loading }) => ({ loading }))(EnhanceDemo);
