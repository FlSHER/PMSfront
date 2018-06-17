import React from 'react';

import style from './index.less';

class PersonIcon extends React.Component {
  render() {
    const { name = '', showNum = 2, handleClick, footer = true, itemStyle = {} } = this.props;
    const newName = name.slice(name.length - (name.length < showNum ? name.length : showNum));
    return (
      <div className={style.person_item} style={itemStyle}>
        <div className={style.person_icon}>
          <div className={style.name}>
            {newName}
            {handleClick ? <span onClick={() => handleClick(name)} /> : null}
          </div>
        </div>
        {footer ? <div className={style.user_info}>{name}</div> : null}

      </div>
    );
  }
}


export default PersonIcon;
