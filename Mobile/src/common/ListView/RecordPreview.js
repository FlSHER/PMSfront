import React, { Component } from 'react';
import { SwipeAction } from 'antd-mobile';
import style from './index.less';

export default class Preview extends Component {
  render() {
    const {
      handleClick,
      hasShortcut = false,
      value,
      label,
    } = this.props;

    return (
      <div className={style.preview}>
        <SwipeAction
          autoClose
          right={[
                {
                  text: '删除',
                  onPress: () => console.log('cancel'),
                  style: { backgroundColor: 'rgb(218,81,85)', minWidth: '1.6rem', color: 'white', fontSize: '12px', borderTopRightRadius: '2px' },
                },
              ]}
        >
          <div className={style.pre_title}>
            {value.name}
          </div>
          <div className={style.predec}>
                  西西西西西西西西西
          </div>
        </SwipeAction>
        <div className={style.person_point}>
          <div className={style.item}>
            <span>魏颖</span>
            <span>A分:1000 <i>(100x10)</i></span>
            <span>B分:1000 <i>(100x10)</i></span>
          </div>
          <div className={style.item}>
            <span>魏颖</span>
            <span>魏颖</span>
            <span>魏颖</span>
          </div>
        </div>
      </div>
    );
  }
}
