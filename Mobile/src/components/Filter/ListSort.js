import React, {
  Component,
} from 'react';
import {
  connect,
} from 'dva';
import Animate from 'rc-animate';
import style from './index.less';
// import styles from '../../routes/common.less';

@connect()
export default class ListSort extends Component {
  state = {
    enter: true,
    destroyed: false,
    visible: false,
    exclusive: false,

  }

  selFilter = (feild) => { // 筛选
    this.setState({
      [feild]: !this.state[feild],
    });
  }
  render() {
    const {
      children,
      visible,
      onCancel,
      filterKey,
      contentStyle,
    } = this.props;
    const conStyle = {
      display: visible ? 'block' : 'none',
      ...contentStyle,
    };
    return (
      <Animate
        component=""
        exclusive={this.state.exclusive}
        showProp="visible"
        transitionAppear
        transitionName="fade"
      >
        <div
          style={conStyle}
          onClick={e => onCancel(e, filterKey)}
          className={style.some_sort}

        >
          <div
            className={style.sort_con}
            onClick={(e) => { e.stopPropagation(); return false; }}
          >
            {children}
          </div>
        </div>
      </Animate>
    );
  }
}

