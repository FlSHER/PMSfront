import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Button, WhiteSpace, Flex } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import { RecordDetail } from '../../../common/ListView';
import { userStorage } from '../../../utils/util';


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

@connect(({ buckle, record }) => ({
  record,
  details: buckle.groupDetails,
}))

export default class EventPreview extends React.Component {
  state = {
    id: '',
  }

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    const { id } = params;
    const newInfo = userStorage('userInfo');
    this.setState({
      id,
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'buckle/getLogGroupDetail',
        payload: { eventId: id },
      });
    });
  }

  getCount = () => {
    const { details } = this.props;
    const { id } = this.state;
    const detail = details[id] | {};
    const { logs = [] } = detail;
    let count = 0;
    logs.forEach((item) => {
      const { participants } = item;
      count += participants.length;
    });
    return count;
  }

  nextStep = () => {
    const { history } = this.props;
    history.push('/buckle_submit');
  }

  submitAgain = (item) => {
    const { history } = this.props;
    history.push(`/buckle_preview?id=${item.id}`);
  }

  withDraw = () => {
    const { dispatch, history } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: {
        id,
        cb: () => {
          // history.push('/buckle_list');
          history.goBack(-1);
        },
      },
    });
  }

  doAudit = (type, state) => {
    const { history } = this.props;
    history.push(`/audit_reason/${type}/${state}/-1`);
  }

  makeApprover = (approver) => {
    const { details } = this.props;
    const { id } = this.state;
    const detail = { ...details[id] || {} };
    return (
      <div key={approver.key}>
        <WhiteSpace size="sm" />
        <WingBlank className={style.parcel} >
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
                  >
                    <span />
                    <p style={{ color: 'rgb(74,74,74)' }}>通过</p>
                    <p style={{ color: 'rgb(155,155,155)', marginTop: '0.1333rem' }}>{approver.description}</p>
                  </div>
                  <div className={style.approver_time}>{approver.time}</div>
                </div>
              ) : detail.rejected_at ?
                  (
                    <div className={style.dec}>
                      <div
                        className={style.describe}
                        style={{ background: 'rgba(207,1,26,0.1)' }}

                      >
                        <span style={{ borderRightColor: 'rgba(207,1,26,0.1)' }} />
                        <p style={{ color: 'rgb(74,74,74)' }}>驳回</p>
                        <p style={{ color: 'rgb(155,155,155)', marginTop: '0.1333rem' }}>{detail.reject_remark}</p>
                      </div>
                      <div className={style.approver_time}>{detail.rejected_at}</div>
                    </div>
                  ) : null}
            </Flex>
          </div>
        </WingBlank>
      </div>
    );
  }

  render() {
    const { details } = this.props;
    const { userInfo, id } = this.state;
    const detail = details[id] || {};
    const { addressees } = detail;
    const footerBtn = [];
    if (Object.keys(detail).length) {
      if (detail.recorder_sn === userInfo.staff_sn) {
        if ([0, 1].indexOf(detail.status_id) !== -1) {
          // 撤回
          footerBtn.push(
            <Flex.Item key="withdraw">
              <Button type="primary" onClick={this.withDraw}>
                撤回
              </Button>
            </Flex.Item>);
        }
        if ([-1, -2, -3].indexOf(detail.status_id) !== -1) {
          // 再次提交
          footerBtn.push(
            <Flex.Item key="submit">
              <Button type="primary" onClick={() => this.submitAgain(detail)}>
                再次提交
              </Button>
            </Flex.Item>);
        }
      }

      const type = detail.status_id.toString();
      const reject = (
        <Flex.Item key="reject">
          <Button type="ghost" onClick={() => this.doAudit(type, 'no')}>
            驳回
          </Button>
        </Flex.Item>
      );
      const pass = (
        <Flex.Item key="pass">
          <Button type="primary" onClick={() => this.doAudit(type, 'yes')}>
            通过
          </Button>
        </Flex.Item>
      );

      if (
        (detail.first_approver_sn === userInfo.staff_sn && detail.status_id === 0)
        ||
        (detail.final_approver_sn === userInfo.staff_sn && detail.status_id === 1)
      ) {
        // 初审 || 终审
        footerBtn.push(reject);
        footerBtn.push(pass);
      }
    }
    const footerAble = footerBtn.length > 0;
    const { logs = [] } = detail;
    const count = this.getCount();
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
    return (
      <div
        className={styles.con}
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players} style={{ paddingBottom: '0.4rem' }}>
              <Flex className={style.title} >
                <Flex.Item >基础信息</Flex.Item>
              </Flex>
              <div>
                <div className={style.event_title}>{detail.title}</div>
                <div className={style.event_remark}>{detail.created_at}</div>
                <div className={style.event_remark}>{detail.remark}</div>
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players} style={{ paddingBottom: '0.4rem' }}>
              <div className={style.title}>
                <div >事件详情</div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'rgb(200, 200, 200)',
                  }}
                  onClick={this.addMySelf}
                >
                  <span style={{ marginRight: '0.8rem' }}>事件数量：{logs.length}</span>
                  <span>总人次：{count}</span>
                </div>
              </div>
              {logs.map((item, i) => {
                const key = i;
                return (
                  <React.Fragment key={key}>
                    <RecordDetail
                      conStyle={{ paddingLeft: 0, borderBottom: '2px dotted rgb(239,239,239)' }}
                      // handleClick={e => this.pointRedirect(e, i)}
                      value={item}
                    />
                  </React.Fragment>
                );
              }
              )}
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          {approvers.map(item => this.makeApprover(item))}
          {detail.status_id === 2 ?
            <WhiteSpace size="sm" /> : null}
          {(detail.status_id === 2 || detail.status_id === -3) ? (
            <WingBlank className={style.parcel}>
              <div className={style.players} style={{ paddingBottom: '0.48rem' }}>
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
                {(addressees || []).map((item, i) => {
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
        {footerAble && (
          <div className={styles.footer}>
            <WingBlank>
              <Flex className={style.opt}>
                {footerBtn}
              </Flex>
            </WingBlank>
          </div>
        )}
      </div>
    );
  }
}

