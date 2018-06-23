import React, { Component } from 'react';
import ListView from '../../routes/Buckle/ListView';
import shortcut from '../../assets/shortcuts.png';
import { buckleState } from '../../utils/convert.js';

import style from './index.less';


@ListView
export default class Buckle extends Component {
  convertStyle = (status) => {
    switch (status) {
      case -2: return 'label_state_0';
      case -1: return 'label_state_1';
      case 0: return 'label_state_3';
      case 1:
      case 2: return 'label_state_2';

      default: return 'label_state_default';
    }
  }
  render() {
    const { handleClick, onShortcut, hasShortcut = true, value } = this.props;
    return (
      <div className={style.event_item}>
        <div className={style.main_info} onClick={() => handleClick(value)}>
          <div className={style.event_title}>
            <span>{value.event_name}</span>
            <div
              className={style[this.convertStyle(value.status_id)]}
            >
              {buckleState(value.status_id)}
            </div>
          </div>
          <div className={style.time}>{value.created_at}</div>
          <div className={style.desc}>
            {value.description}
          </div>
        </div>
        {hasShortcut && (value.status_id === 0 || value.status_id === 1) ?
          (
            <div className={style.aside}>
              <img
                src={shortcut}
                alt="快捷操作"
                onClick={() => onShortcut(value)}
              />
            </div>
) : null}

      </div>
    );
  }
}
