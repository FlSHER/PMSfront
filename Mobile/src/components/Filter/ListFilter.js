import React, { Component } from 'react';
import Animate from 'rc-animate';
import style from './index.less';
import styles from '../../routes/common.less';

class ListFilter extends Component {
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
      onOk,
      onCancel,
      visible,
      filterKey,
      contentStyle,
    } = this.props;
    // const anim = {
    //   enter: this.animateEnter,
    //   leave: this.animateLeave,
    // };
    const conStyle = {
      display: visible ? 'block' : 'none',
      ...contentStyle,
    };
    return (
      <div>
        <Animate
          component=""
          exclusive={this.state.exclusive}
          showProp="visible"
          transitionAppear
          transitionName="fade"
        // animation={anim}
        >
          <div
            style={conStyle}
            onClick={() => this.hideModel}
          >
            <div className={style.filter_con}>
              <div className={styles.con}>
                <div className={styles.header}>
                  <p className={style.title}>筛选</p>
                </div>
                <div className={styles.con_content}>
                  {children}
                </div>
                <div
                  className={styles.footer}
                  style={{ background: '#f8f6f6' }}
                >
                  <a
                    onClick={() => {
                      onOk(filterKey);
                    }}
                  ><span>确定</span>
                  </a>
                  <a onClick={onCancel}><span>取消</span></a>
                </div>
              </div>
            </div>
          </div>
        </Animate>
      </div>
    );
  }
}

export default ListFilter;
