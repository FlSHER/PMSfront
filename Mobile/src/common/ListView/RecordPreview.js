import React, { Component } from 'react';
import { SwipeAction } from 'antd-mobile';
import style from './index.less';

export default class Preview extends Component {
  renderPoint = () => {
    const { value } = this.props;
    const { participants } = value;
    const items = participants.map((item, i) => {
      const key = i;
      return (
        <div className={style.item} key={key}>
          <span>{item.realname}</span>
          <span>A分:{item.point_a * item.count} <i>({item.point_a}x{item.count})</i></span>
          <span>B分:{item.point_b * item.count} <i>({item.point_b}x{item.count})</i></span>
        </div>
      );
    });
    return items;
  }
  render() {
    const {
      value,
      handleClick,
      extraClick,
    } = this.props;
    const extra = {
      text: '删除',
      onPress: extraClick,
      style: { backgroundColor: 'rgb(218,81,85)', minWidth: '1.6rem', color: 'white', fontSize: '12px', borderTopRightRadius: '2px' },
    };
    return (
      <div
        className={style.preview}
        onClick={handleClick}
      >
        <SwipeAction
          autoClose
          right={[
            extra,
              ]}
        >
          <div className={style.pre_title}>
            {value.name}
          </div>
          <div className={style.predec}>
            {value.description}
          </div>
        </SwipeAction>
        <div className={style.person_point}>
          {this.renderPoint()}
        </div>
      </div>
    );
  }
}
