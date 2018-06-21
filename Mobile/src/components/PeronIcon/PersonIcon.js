import React from 'react';

import style from './index.less';

class PersonIcon extends React.Component {
  render() {
    const {
      showNum = 2, handleClick, footer = true, itemStyle = {}, value = {}, nameKey, type,
    } = this.props;
    const name = value[nameKey] ? value[nameKey] : '';
    const newName = name.slice(name.length - (name.length < showNum ? name.length : showNum));
    return (
      <div
        className={style.person_item}
        style={itemStyle}
        onClick={type === '1' ? () => handleClick(value) : () => {}}
      >
        <div className={style.person_icon}>
          <div className={style.name}>
            {newName}
            {type === '2' ? <span onClick={() => handleClick(value)} /> : null}
          </div>
        </div>
        {footer ? <div className={style.user_info}>{name}</div> : null}

      </div>
    );
  }
}


export default PersonIcon;
