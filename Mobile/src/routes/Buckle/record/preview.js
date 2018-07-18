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
  state = {
    modal: {// 模态框
      filterModal: false,
      sortModal: false,
      offsetBottom: 0,
    },
  }


  render() {
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
11
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

