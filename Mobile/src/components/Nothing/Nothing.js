import React from 'react';

import {
  connect,
} from 'dva';
import style from './index.less';
import nothing from '../../assets/nothing.png';

class Nothing extends React.Component {
  render() {
    const { src = `${nothing}` } = this.props;
    return (
      <div style={{
  display: 'flex',
  flexGrow: 1,
  height: '100%' }}
      >
        <div className={style.nothing}>
          <img
            src={src}
            alt="img"
          />
          <span>暂无数据</span>
        </div>
      </div>
    );
  }
}

Nothing.propTypes = {};

export default connect()(Nothing);
