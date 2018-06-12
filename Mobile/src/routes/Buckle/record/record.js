import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank, WhiteSpace, InputItem } from 'antd-mobile';
import defaultAvatar from '../../../assets/default_avatar.png';
import style from '../index.less';
import styles from '../../common.less';

class BuckleRecord extends React.Component {
  render() {
    return (
      <Flex
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item arrow="horizontal">
                事件标题
              </List.Item>
              <TextareaItem
                placeholder="输入事件描述"
                rows={5}
                labelNumber={5}
              />
              <div className={style.textinfo}>
                还可输入0字
              </div>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div
              className={style.players}
            >
              <Flex className={style.title}> 参与人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <div className={style.person_item}>
                  <div className={style.name}>
                    魏颖
                    <span />
                  </div>
                </div>
                <div className={style.person_item}>
                  <div className={style.name}>
                    魏颖
                    <span />
                  </div>
                </div>
                <div className={[style.person_item, style.spe].join(' ')}>
                  <img
                    src={defaultAvatar}
                    alt="添加"
                  />
                </div>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div
              className={style.players}
            >
              <Flex className={style.title}> 参与人列表</Flex>
              <Flex className={style.table_head}>
                <Flex.Item className={style.table_item}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>A分</Flex.Item>
                <Flex.Item className={style.table_item}>B分</Flex.Item>
              </Flex>
              <div className={style.table_body}>
                {[1, 2, 3].map((item, i) => {
                  const idx = i;
                  return (
                    <Flex key={idx}>
                      <Flex.Item className={style.table_item}>全部操作</Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem />
                      </Flex.Item>
                    </Flex>);
                })
                }
              </div>
            </div>
          </WingBlank>
        </div>
      </Flex>
    );
  }
}

BuckleRecord.propTypes = {};

export default connect()(BuckleRecord);
