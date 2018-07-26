import React, { Component } from 'react';
import { WingBlank, Button, WhiteSpace } from 'antd-mobile';
import submitok from '../../../assets/submitok.png';
import style from '../index.less';
import styles from '../../common.less';

const bottomOpt = [
  { name: '返回首页', type: 'ghost', link: '/home', linkMethod: 'push' },
  { name: '再记一笔', type: 'primary', link: '', linkMethod: 'goBack' },
];
export default class RecordOk extends Component {
  renderBottomBtn = () => {
    const { history } = this.props;
    const footerBtn = bottomOpt.map((item) => {
      return (
        <React.Fragment>
          <WhiteSpace size="sm" />
          <WingBlank>
            <Button
              type={item.type}
              onClick={() => {
                if (item.link) {
                   history.replace(item.link);
                } else {
                     history.goBack(-1);
                    }
                }}
            >{item.name}
            </Button>
          </WingBlank>
        </React.Fragment>
      );
    });
    return footerBtn;
  }
  render() {
    const footerBtn = this.renderBottomBtn();
    const footerAble = footerBtn.length > 0;
    return (
      <div
        className={styles.con}
      >
        <div className={styles.con_content} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={style.submit_ok}>
            <img src={submitok} alt="提交成功" />
            <span style={{ marginTop: '0.26667rem' }}>提交成功</span>
          </div>
        </div>
        {footerAble && (
        <div className={styles.footer}>
          <div style={{ padding: '0 0 0.64rem 0' }}>
            {footerBtn}
          </div>
        </div>
        )}
      </div>
    );
  }
}
