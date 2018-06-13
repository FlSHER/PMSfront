import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank, WhiteSpace, InputItem, Button, DatePicker } from 'antd-mobile';
import defaultAvatar from '../../../assets/default_avatar.png';
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
            <DatePicker
              mode="date"
            >
              <List.Item arrow="horizontal">事件时间</List.Item>
            </DatePicker>

          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 参与人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={[style.person_icon, style.spe].join(' ')}>
                    <div className={style.name}>
                      <img
                        src={defaultAvatar}
                        alt="添加"
                      />
                    </div>
                  </div>
                  <div className={style.user_info}>&nbsp;</div>
                </div>
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 参与人列表</Flex>
              <Flex className={style.table_head}>
                <Flex.Item className={style.table_item}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>A分</Flex.Item>
                <Flex.Item className={style.table_item}>B分</Flex.Item>
                <Flex.Item className={style.table_item}>计件</Flex.Item>
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
              <Flex className={style.title}> 初审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={[style.person_icon, style.spe].join(' ')}>
                    <div className={style.name}>
                      <img
                        src={defaultAvatar}
                        alt="添加"
                      />
                    </div>
                  </div>
                  <div className={style.user_info}>&nbsp;</div>
                </div>
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
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={[style.person_icon, style.spe].join(' ')}>
                    <div className={style.name}>
                      <img
                        src={defaultAvatar}
                        alt="添加"
                      />
                    </div>
                  </div>
                  <div className={style.user_info}>&nbsp;</div>
                </div>
              </Flex>
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
                <div className={style.person_item}>
                  <div className={style.person_icon}>
                    <div className={style.name}>
                      魏颖
                      <span />
                    </div>
                  </div>
                  <div className={style.user_info}>魏颖</div>
                </div>
                <div className={style.person_item}>
                  <div className={[style.person_icon, style.spe].join(' ')}>
                    <div className={style.name}>
                      <img
                        src={defaultAvatar}
                        alt="添加"
                      />
                    </div>
                  </div>
                  <div className={style.user_info}>&nbsp;</div>
                </div>
              </Flex>
            </div>
          </WingBlank>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button type="primary">提交</Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

BuckleRecord.propTypes = {};

export default connect()(BuckleRecord);
