import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, Button } from 'antd-mobile';
import { PersonIcon } from '../../../components/index.js';
import { Label } from '../../../components/General/index';
import { buckleState } from '../../../utils/convert.js';
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
@connect(({ buckle }) => ({
  buckleDetail: buckle.buckleDetails,
  groupDetail: buckle.groupDetail,
}))
export default class AuditDetail extends React.Component {
  state = {
    eventId: '',
    userInfo: {},
  }

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    const { id } = params;
    const newInfo = userStorage('userInfo');
    this.setState({
      eventId: id,
      userInfo: newInfo,
    });
    dispatch({
      type: 'buckle/getBuckleDetail',
      payload: { eventId: id },
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
    const { dispatch, history } = this.props;
    dispatch({
      type: 'record/clearModal',
    });
    dispatch({
      type: 'event/clearModal',
    });
    history.push(`/buckle_record/${item.id}`);
  }

  doAudit = (type, state) => {
    const { history } = this.props;
    history.push(`/audit_reason/${type}/${state}/-2`);
  }

  makeApprover = (approver) => {
    const { buckleDetail } = this.props;
    const { eventId } = this.state;
    const detail = { ...buckleDetail[eventId] || {} };
    const approveInfo = {};
    if ((detail.status_id === 1 || detail.status_id === 0) && !approver.time) {
      approveInfo.statusText = '审核中...';
    } else if (approver.time) {
      approveInfo.statusText = '通过';
      approveInfo.time = approver.time;
      approveInfo.remark = approver.description || '无';
    } else if (
      !approver.time &&
      detail.status_id === -1 &&
      approver.sn === detail.rejecter_sn
    ) {
      approveInfo.statusText = '驳回';
      approveInfo.time = detail.rejected_at;
      approveInfo.remark = detail.reject_remark;
      approveInfo.style = {
        div: { background: 'rgba(207,1,26,0.1)' },
        span: { borderRightColor: 'rgba(207,1,26,0.1)' },
      };
    }

    return (
      <div key={approver.key}>
        <WhiteSpace size="md" />
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
              {
                (
                  // detail.rejected_at
                   approveInfo.time
                  || (detail.status_id === approver.checkStatus)
                ) && (
                  <div className={style.dec}>
                    <div
                      className={style.describe}
                      style={approveInfo.style ? approveInfo.style.div : null}
                    >
                      <span style={approveInfo.style ? approveInfo.style.span : null} />
                      <p style={{ color: !(detail.status_id === 0 || detail.status_id === 1) ? 'rgb(74,74,74)' : '#666' }}>
                        {approveInfo.statusText}
                      </p>
                      <p style={{ color: 'rgb(155,155,155)', marginTop: '0.1333rem' }}>{approveInfo.remark}</p>
                    </div>
                    <div className={style.approver_time}>{approveInfo.time}</div>
                  </div>
                )}
            </Flex>
          </div>
        </WingBlank>
      </div>
    );
  }

  render() {
    const { buckleDetail = {} } = this.props;
    const { eventId } = this.state;
    const detail = buckleDetail ? buckleDetail[eventId] : {};
    const newDetail = { ...detail || {} };
    const participant = newDetail.participants;
    const addresseess = [...((newDetail.group && newDetail.group.addressees) || [])];
    const { userInfo } = this.state;
    const approvers = [
      {
        sn: newDetail.first_approver_sn,
        title: '初审人',
        name: newDetail.first_approver_name,
        description: newDetail.first_approve_remark,
        key: 'first_approver_name',
        time: newDetail.first_approved_at,
        checkStatus: 0,
      },
      {
        sn: newDetail.final_approver_sn,
        title: '终审人',
        name: newDetail.final_approver_name,
        description: newDetail.final_approve_remark,
        key: 'final_approver_name',
        time: newDetail.final_approved_at,
        checkStatus: 1,
      },
    ];
    const footerBtn = [];
    if (Object.keys(newDetail).length) {
      if (newDetail.recorder_sn === userInfo.staff_sn) {
        if ([0, 1].indexOf(newDetail.status_id) !== -1) {
          // 撤回
          footerBtn.push(
            <Flex.Item key="withdraw">
              <Button type="primary" onClick={this.withDraw}>
                撤回
              </Button>
            </Flex.Item>);
        }
        // if ([-1, -2, -3].indexOf(newDetail.status_id) !== -1) {
        // 再次提交
        footerBtn.push(
          <Flex.Item key="submit">
            <Button type="primary" onClick={() => this.submitAgain(newDetail)}>
                再次提交
            </Button>
          </Flex.Item>);
        // }
      }

      const type = newDetail.status_id.toString();
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
        (newDetail.first_approver_sn === userInfo.staff_sn && newDetail.status_id === 0)
        ||
        (newDetail.final_approver_sn === userInfo.staff_sn && newDetail.status_id === 1)
      ) {
        // 初审 || 终审
        footerBtn.push(reject);
        footerBtn.push(pass);
      }
    }
    const footerAble = footerBtn.length > 0;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="md" />
          <WingBlank className={style.parcel}>
            <List>
              <div style={{ padding: '0 15px' }}>
                <div className={style.event_title}>
                  {newDetail.event_name}
                  <Label value={newDetail} content={buckleState(newDetail.status_id)} />
                </div>
              </div>
              {newDetail.description && (
              <div style={{ padding: '0 15px 10px 15px' }}>
                {newDetail.description}
              </div>
              )}
            </List>
          </WingBlank>
          <WhiteSpace size="md" />

          <WingBlank className={[style.parcel, style.nobottom].join(' ')}>
            <List>
              <List.Item extra={newDetail.executed_at}>
                事件时间
              </List.Item>
            </List>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank className={style.parcel}>
            <div className={style.players} style={{ paddingBottom: '0.48rem' }}>
              <Flex className={style.title}> 参与人列表</Flex>
              <Flex
                className={style.table_head}
                align="center"
                justify="center"
              >
                <Flex.Item className={style.table_item} style={{ borderLeft: 'none' }}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>单次A分</Flex.Item>
                <Flex.Item className={style.table_item}>单次B分</Flex.Item>
                <Flex.Item className={style.table_item} style={{ borderRight: 'none' }}>次数</Flex.Item>
              </Flex>
              <div className={style.table_body}>
                {(participant || []).map((item, i) => {
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
          {approvers.filter(_ => _.name).map(item => this.makeApprover(item))}
          {newDetail.status_id === 2 && (
            <React.Fragment>
              <WhiteSpace size="md" />
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
                        <Flex.Item className={style.table_item}>{newDetail[item.value]}</Flex.Item>
                        <Flex.Item className={style.table_item}>{newDetail[item.key]}</Flex.Item>

                      </Flex>);
                  })
                  }
                  </div>
                </div>
              </WingBlank>
            </React.Fragment>

          ) }
          {addresseess && addresseess.length ? (
            <React.Fragment>
              <WhiteSpace size="md" />
              <WingBlank className={style.parcel}>
                <div className={style.players}>
                  <Flex className={style.title}> 抄送人</Flex>
                  <Flex
                    className={style.person_list}
                    wrap="wrap"
                  >
                    {(addresseess || []).map((item, i) => {
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
            </React.Fragment>
          ) : null}
          {newDetail.recorder_name && (
          <React.Fragment>
            <WhiteSpace size="md" />
            <WingBlank className={style.parcel}>
              <div className={style.players}>
                <Flex className={style.title}> 记录人</Flex>
                <Flex
                  className={style.person_list}
                  wrap="wrap"
                >
                  <PersonIcon
                    value={newDetail}
                    type="1"
                    nameKey="recorder_name"
                  />
                </Flex>
              </div>
            </WingBlank>
          </React.Fragment>
          )
         }

          <WhiteSpace size="md" />
        </div>

        {false && footerAble && (
          <div className={styles.footer}>
            <Flex className={style.opt}>
              {footerBtn}
            </Flex>
          </div>
        )}
      </div>
    );
  }
}

