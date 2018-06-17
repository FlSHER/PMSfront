import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';

import style from '../index.less';
import styles from '../../common.less';

@connect()
export default class AuditDetail extends React.Component {
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
              <List.Item>
                事件标题
              </List.Item>
              <div style={{ padding: '0.4rem 15px' }}>
              ssss觉得今
              天天气好晴朗，处处好风光
              ，才怪，天天下雨，不喜欢下雨
              ，风扇的风太大了，没有小风，吹
              着又觉得冷飕飕
              </div>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item extra="2018.12.09">
                事件事件
              </List.Item>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 参与人</Flex>
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
              <Flex className={style.title}> 参与人列表</Flex>
              <Flex
                className={style.table_head}
                align="center"
                justify="center"
              >
                <Flex.Item className={style.table_item}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>A分</Flex.Item>
                <Flex.Item className={style.table_item}>B分</Flex.Item>
                <Flex.Item className={style.table_item}>计件</Flex.Item>
              </Flex>
              <div className={style.table_body}>
                {[1, 2, 3].map((item, i) => {
                  const idx = i;
                  return (
                    <Flex key={idx} align="center">
                      <Flex.Item className={style.table_item}>全部操作</Flex.Item>
                      <Flex.Item className={style.table_item}>
                        1
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        1
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        1
                      </Flex.Item>
                    </Flex>);
                })
                }
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 初审人</Flex>
              <Flex
                wrap="wrap"
                align="start"
                style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
              >
                <div style={{ marginRight: '0.64rem' }}>
                  <PersonIcon
                    name="魏颖"
                    showNum={2}
                    itemStyle={{ marginBottom: 0 }}
                  />
                </div>
                <div
                  className={style.describe}
                >
                  <span />
                  加你的讲课费就是你大家
                </div>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 终审人</Flex>
              <Flex
                wrap="wrap"
                align="start"
                style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
              >
                <div style={{ marginRight: '0.64rem' }}>
                  <PersonIcon
                    itemStyle={{ marginBottom: 0 }}
                    name="魏颖"
                    showNum={2}
                  />
                </div>
                <div
                  className={style.describe}
                >
                  <span />
                  加你的讲课费就是你大家
                  好就的举报的举报是奖扣DVD是否能对健康加
                  你的讲课费就是你大家好就的举报的举报是奖扣DVD是否能对健康
                加你的讲课费就是你大家好就的举报的举报是奖扣DVD是否能对健康
                </div>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 配置分值</Flex>
              <Flex
                className={style.table_head}
                align="center"
                justify="center"
              >
                <Flex.Item className={style.table_item}>名称</Flex.Item>
                <Flex.Item className={style.table_item}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>B分</Flex.Item>
              </Flex>
              <div className={style.table_body}>
                {[1, 2].map((item, i) => {
                const idx = i;
                return (
                  <Flex key={idx}>
                    <Flex.Item className={style.table_item}>{i === 0 ? '记录人' : '初审人'}</Flex.Item>
                    <Flex.Item className={style.table_item}>姓名</Flex.Item>
                    <Flex.Item className={style.table_item}>
                      <InputItem />
                    </Flex.Item>
                  </Flex>);
              })
              }
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 抄送人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  name="魏颖"
                  showNum={2}
                />
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 记录人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  name="魏颖"
                  showNum={2}
                />
              </Flex>
            </div>
          </WingBlank>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <Flex className={style.opt}>
              <Flex.Item><Button type="ghost">驳回</Button></Flex.Item>
              <Flex.Item><Button type="primary">通过</Button></Flex.Item>
            </Flex>
          </WingBlank>
        </div>
      </div>
    );
  }
}

