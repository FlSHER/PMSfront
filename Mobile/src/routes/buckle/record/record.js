import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank } from 'antd-mobile';
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
          <WingBlank className={style.parcel}>
            <div
              className={style.players}
              direction="column"
              align="start"
            >
              <Flex className={style.title}> 参与人</Flex>
              <Flex className={style.person_list}>
                <div className={style.person_item}>
                  魏颖
                </div>

              </Flex>
            </div>
          </WingBlank>
        </div>
      </Flex>
    );
  }
}

BuckleRecord.propTypes = {};

export default connect()(BuckleRecord);
