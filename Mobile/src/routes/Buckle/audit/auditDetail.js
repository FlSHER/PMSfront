import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, InputItem, Button } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import { analyzePath } from '../../../utils/util';
import style from '../index.less';
import styles from '../../common.less';

@connect(({ buckle, oauth }) => ({
  detail: buckle.detail,
  userInfo: oauth.userInfo,
}))
export default class AuditDetail extends React.Component {
  state={
    eventId: '',
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    const eventId = analyzePath(location.pathname, 1);
    this.setState({
      eventId,
    }, () => {
      dispatch({
        type: 'buckle/getBuckleDetail',
        payload: eventId,
      });
    });
  }
  withDraw =() => {
    const { dispatch, history } = this.props;
    const { eventId } = this.state;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: {
        id: eventId,
        cb: () => {
          history.push('/buckle_list');
        },
      },
    });
  }
  submitAgain =() => {
    const { history } = this.props;
    history.push('/record_buckle');
  }
  doAudit = (type, state) => {
    const { history } = this.props;
    const { eventId } = this.state;
    history.push(`/audit_reason/${type}/${state}/${eventId}`);
  }
  render() {
    const { detail, userInfo } = this.props;
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
                {detail.event_name}
              </List.Item>
              <div style={{ padding: '0.4rem 15px' }}>
                {detail.description ? detail.description : '暂无'}
              </div>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item extra={detail.executed_at}>
                事件时间
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
                {(detail.participant || []).map((item, i) => {
                const idx = i;
                return (
                  <PersonIcon
                    key={idx}
                    value={item}
                    type="1"
                    nameKey="staff_name"
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
                {(detail.participant || []).map((item, i) => {
                  const idx = i;
                  return (
                    <Flex key={idx}>
                      <Flex.Item className={style.table_item}>{item.staff_name}</Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.point_a}
                        />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.point_b}
                        />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.count}
                        />
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
                    value={detail}
                    type="1"
                    nameKey="first_approver_name"
                    showNum={2}
                    itemStyle={{ marginBottom: 0 }}
                  />
                </div>
                <div
                  className={style.describe}
                >
                  <span />
                  {detail.first_approve_remark}
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
                    value={detail}
                    type="1"
                    nameKey="final_approver_name"
                    showNum={2}
                    itemStyle={{ marginBottom: 0 }}
                  />
                </div>
                <div
                  className={style.describe}
                >
                  <span />
                  {detail.final_approve_remark}
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
                {(detail.addressee || []).map((item, i) => {
                const idx = i;
                return (
                  <PersonIcon
                    key={idx}
                    value={item}
                    type="1"
                    nameKey="staff_name"
                    showNum={2}
                  />);
                })
              }
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
                  value={detail}
                  type="1"
                  nameKey="recorder_name"
                  showNum={2}
                />
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="lg" />
        </div>

        <div className={styles.footer}>
          <WingBlank>
            <Flex className={style.opt}>
              {detail.first_approver_sn === userInfo.staff_sn && detail.status_id === 0 ?
                <Flex.Item><Button type="ghost" onClick={() => this.doAudit('1', 'no')}>初审驳回</Button></Flex.Item> : null}
              {detail.first_approver_sn === userInfo.staff_sn && detail.status_id === 0 ?
                <Flex.Item><Button type="primary" onClick={() => this.doAudit('1', 'yes')}>初审通过</Button></Flex.Item> : null}

              {detail.final_approver_sn === userInfo.staff_sn && detail.status_id === 1 ?
                <Flex.Item><Button type="ghost" onClick={() => this.doAudit('2', 'no')}>终审驳回</Button></Flex.Item> : null}
              {detail.final_approver_sn === userInfo.staff_sn && detail.status_id === 1 ?
                <Flex.Item><Button type="primary" onClick={() => this.doAudit('2', 'yes')}>终审通过</Button></Flex.Item> : null}

              { detail.recorder_sn === userInfo.staff_sn &&
                (detail.status_id === 0 || detail.status_id === 1) ?
                  <Flex.Item><Button type="primary" onClick={this.withDraw}>撤回</Button></Flex.Item> : null}
              { detail.recorder_sn === userInfo.staff_sn &&
                (detail.status_id === -1 || detail.status_id === -2) ?
                  <Flex.Item><Button type="primary" onClick={this.submitAgain}>再次提交</Button></Flex.Item> : null}

            </Flex>
          </WingBlank>
        </div>
      </div>
    );
  }
}

