import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import style from '../index.less';
import styles from '../../common.less';
import { PersonIcon } from '../../../components/index.js';
@connect()
export default class PointDetail extends React.Component {
  render() {
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item >
                积分事件标题
              </List.Item>
            </List>
            <div className={style.event_info}>
              <div
                className={style.person_item}
                style={{ display: 'inline-block', marginBottom: 0, width: 'auto', marginRight: '0.27rem' }}
              >
                <div className={style.person_icon} style={{ width: '0.75rem', height: '0.75rem', lineHeight: '0.75rem' }}>
                  <div className={style.name}>
                颖
                  </div>
                </div>
              </div>
              <span>魏颖（122222）</span>
            </div>
            <div className={style.event_info}>
              <span>品牌</span>
              <span>店铺</span>
            </div>
            <div className={style.event_info}>
              <span>部门</span>
              <span>店铺</span>
            </div>
            <div className={style.event_info}>
              <span>店铺</span>
              <span>店铺</span>
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
                <div style={{ color: 'rgb(74,74,74)', fontSize: '14px' }}>A分变化</div>
                <div><a style={{ color: 'rgb(155,155,155)', fontSize: '12px' }}> 来源：任务积分</a></div>
              </Flex>
              <Flex className={style.point_change}>
                <Flex.Item style={{ fontSize: '36px', color: 'rgb(0,150,136)', textAlign: 'center' }}>+0</Flex.Item>
                <Flex.Item>
                  <div className={style.time}>变化时间：2013.12.5</div>
                  <div className={style.time}>记录时间：2018.8.9</div>
                </Flex.Item>
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
                <div style={{ color: 'rgb(74,74,74)', fontSize: '14px' }}>B分变化</div>
                <div><a style={{ color: 'rgb(155,155,155)', fontSize: '12px' }}> 来源：任务积分</a></div>
              </Flex>
              <Flex className={style.point_change}>
                <Flex.Item style={{ fontSize: '36px', color: 'rgb(229,28,35)', textAlign: 'center' }}>-0</Flex.Item>
                <Flex.Item>
                  <div className={style.time}>变化时间：2013.12.5</div>
                  <div className={style.time}>记录时间：2018.8.9</div>
                </Flex.Item>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 初审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                {[1, 2, 3].map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      name="魏颖"
                      showNum={2}
                    />
                  );
                })}
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 终审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  name="张博涵哈哈哈"
                  showNum={2}
                />
              </Flex>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

