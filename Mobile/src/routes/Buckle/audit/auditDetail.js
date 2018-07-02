import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, Button } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import { Label } from '../../../components/General/index';
import { buckleState } from '../../../utils/convert.js';
import { analyzePath, userStorage } from '../../../utils/util';
import style from '../index.less';
import styles from '../../common.less';

const person = [
  {
    key: 'recorder_point',
    id: 0,
    value: 'recorder_name',
    name: '记录人',
  },
  {
    key: 'first_approver_point',
    id: 1,
    value: 'first_approver_name',
    name: '初审人',
  },
];
@connect(({ buckle }) => ({
  detail: buckle.detail,
}))
export default class AuditDetail extends React.Component {
  state = {
    eventId: '',
    userInfo: {},
  }
  componentWillMount() {
    const { dispatch, location } = this.props;
    const eventId = analyzePath(location.pathname, 1);
    const newInfo = userStorage('userInfo');
    this.setState({
      eventId,
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'buckle/getBuckleDetail',
        payload: { eventId },
      });
    });
  }
  withDraw = () => {
    const { dispatch, history } = this.props;
    const { eventId } = this.state;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: {
        id: eventId,
        cb: () => {
          // history.push('/buckle_list');
          history.goBack(-1);
        },
      },
    });
  }
  submitAgain = (item) => {
    const { history } = this.props;
    history.push(`/buckle_record/${item.id}`);
  }
  doAudit = (type, state) => {
    const { history } = this.props;
    history.push(`/audit_reason/${type}/${state}`);
  }
  makeApprover = (approver) => {
    const { detail } = this.props;
    return (
      <div>
        <WhiteSpace size="sm" />
        <WingBlank className={style.parcel} key={approver.key}>
          <div className={style.players}>
            <Flex className={style.title}>{approver.title} </Flex>
            <Flex
              wrap="wrap"
              align="start"
              style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
            >
              <div style={{ marginRight: '0.64rem' }}>
                <PersonIcon
                  value={detail}
                  type="1"
                  nameKey={approver.key}
                  showNum={2}
                  itemStyle={{ marginBottom: 0 }}
                />
              </div>
              {approver.time ? (
                <div className={style.dec}>
                  <div
                    className={style.describe}
                    style={{ ...(detail.rejected_at ? { background: 'rgba(207,1,26,0.1)' } : null) }}

                  >
                    <span />
                    <p style={{ color: 'rgb(74,74,74)' }}>{detail.rejected_at ? '驳回' : '通过'}</p>
                    <p style={{ color: 'rgb(155,155,155)', marginTop: '0.1333rem' }}>{approver.description}</p>
                  </div>
                  <div className={style.approver_time}>{approver.time}</div>
                </div>
              ) : null}
            </Flex>
          </div>
        </WingBlank>
      </div>
    );
  }
  render() {
    const { detail } = this.props;
    const { userInfo } = this.state;
    const approvers = [
      {
        sn: detail.first_approver_sn,
        title: '初审人',
        name: detail.first_approver_name,
        description: detail.first_approve_remark,
        key: 'first_approver_name',
        time: detail.first_approved_at,
      },
      {
        sn: detail.final_approver_sn,
        title: '终审人',
        name: detail.final_approver_name,
        description: detail.final_approve_remark,
        key: 'final_approver_name',
        time: detail.final_approved_at,
      },
    ];
    // if (detail.status_id === 1 || (detail.first_approved_at && detail.status_id === -2)) {
    //   approvers = approvers.filter(item => item.sn === detail.first_approver_sn);
    // } else if (detail.status_id === 0
    // || (detail.status_id === -2 && !detail.first_approved_at)) {
    //   approvers = [];
    // } else if (detail.status_id === -1) {
    //   const temp = [];
    //   approvers.find((item) => {
    //     temp.push(item);
    //     if (item.sn === detail.rejecter_sn) {
    //       return true;
    //     }
    //     return false;
    //   });
    //   approvers = [...temp];
    // }
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <List>
              <div style={{ padding: '0.4rem 15px' }}>
                <div className={style.event_title}>
                  {detail.event_name}
                  <Label value={detail} content={buckleState(detail.status_id)} />
                </div>
              </div>
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
            <div className={style.players} style={{ paddingBottom: '0.48rem' }}>
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
                        {item.point_a}

                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        {item.point_b}

                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        {item.count}

                      </Flex.Item>
                    </Flex>);
                })
                }
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          {approvers.map(item => this.makeApprover(item))}
          <WhiteSpace size="sm" />
          {detail.status_id === 2 ? (
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
                  {person.map((item, i) => {
                    const idx = i;
                    return (
                      <Flex key={idx}>
                        <Flex.Item className={style.table_item}>{item.name}</Flex.Item>
                        <Flex.Item className={style.table_item}>{detail[item.value]}</Flex.Item>
                        <Flex.Item className={style.table_item}>{detail[item.key]}</Flex.Item>

                      </Flex>);
                  })
                  }
                </div>
              </div>
            </WingBlank>
          ) : null}
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

              {detail.recorder_sn === userInfo.staff_sn &&
                (detail.status_id === 0 || detail.status_id === 1) ?
                  <Flex.Item><Button type="primary" onClick={this.withDraw}>撤回</Button></Flex.Item> : null}
              {detail.recorder_sn === userInfo.staff_sn &&
                (detail.status_id === -1 || detail.status_id === -2) ?
                  <Flex.Item><Button type="primary" onClick={() => this.submitAgain(detail)}>再次提交</Button></Flex.Item> : null}
            </Flex>
          </WingBlank>
        </div>
      </div>
    );
  }
}

