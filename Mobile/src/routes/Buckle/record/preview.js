import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex, Button } from 'antd-mobile';

import { Ranking } from '../../../common/ListView';
import nothing from '../../../assets/nothing.png';
import { userStorage, getUrlParams, scrollToAnchor } from '../../../utils/util';
import style from '../index.less';
import styles from '../../common.less';


@connect(({ ranking, loading }) => ({
  ranking: ranking.ranking,
  loading,
  group: ranking.group,
}))
export default class PointRanking extends React.Component {
  render() {
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
          <div className={style.all_info}>
            <div className={style.left}>
              <span>事件数量</span>
              <span>总人次</span>
            </div>
            <div className={style.add}>
              <Button
                type="ghost"
                inline
                size="small"
                style={{
                  border: '1px dashed rgb(199,199,199)',
                  color: 'rgb(155,155,155)',
                }}
              >
            添加事件
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button
                type="primary"
                onClick={this.next}
              >下一步
              </Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

