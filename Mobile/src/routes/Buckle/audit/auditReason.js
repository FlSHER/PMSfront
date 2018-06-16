import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, WingBlank, WhiteSpace, Button, Flex, InputItem } from 'antd-mobile';
import style from '../index.less';
import styles from '../../common.less';

class BuckleRecord extends React.Component {
  render() {
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>

          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 配置分值</Flex>
              <Flex className={style.table_head}>
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
            <List>
              <List.Item>
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

        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button type="primary">确认驳回/通过</Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

BuckleRecord.propTypes = {};

export default connect()(BuckleRecord);
