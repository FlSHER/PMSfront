import React from 'react';
import {
  connect,
} from 'dva';
import { Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import { Point } from '../../../common/ListView/index';
import style from '../index.less';
import styles from '../../common.less';

@connect()
export default class PointSurvey extends React.Component {
  render() {
    return (
      <div
        className={styles.con}
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
          <WingBlank>
            <div className={style.survey}>
              <Flex style={{ padding: '0.24rem 0 1.5rem 0' }}>
                <Flex.Item style={{ textAlign: 'center', fontSize: '48px' }}>0</Flex.Item>
              </Flex>
              <Flex style={{ textAlign: 'center', fontSize: '12px' }}>
                <Flex.Item>总奖分：0</Flex.Item>
                <Flex.Item>总扣分：0</Flex.Item>
                <Flex.Item>系统分：0</Flex.Item>
                <Flex.Item>基础分：0</Flex.Item>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank>
            <div className={style.players}>
              <Flex
                className={style.title}
                justify="between"
                align="center"
              >
                <div>积分明细</div>
                <div>
                  <a href="/point_list" style={{ color: 'rgb(24,116,208)' }}>查看更多</a>
                </div>
              </Flex>
              <Point dataSource={[1, 2]} />
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

