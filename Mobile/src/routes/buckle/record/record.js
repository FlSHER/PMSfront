import React from 'react';
import moment from 'moment';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank, WhiteSpace, InputItem, Button, DatePicker, Toast } from 'antd-mobile';
import { PersonIcon, PersonAdd } from '../../../components/index.js';
import { analyzePath } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';
import prompt from '../../../assets/prompt.svg';
@connect(({ buckle, searchStaff, loading, event }) => ({
  buckle,
  loading,
  searchStaff,
  event: event.event,
}))
export default class BuckleRecord extends React.Component {
  state = {
    init: false,
    optAll: {
      pointA: '',
      pointB: '',
      count: '',
    },
    info: {
      executedAt: new Date(),
      description: '',
      participants: [],
    },
  }
  componentWillMount() {
    const { dispatch, location, event } = this.props;
    const eventId = analyzePath(location.pathname, 1);
    if (eventId && event && !Object.keys(event)) { // 没有赋值过
      dispatch({
        type: 'buckle/getBuckleDetail',
        payload: {
          eventId,
          cb: (data) => {
            dispatch({
              type: 'buckle/saveData',
              payload: {
                key: 'info',
                used: false,
                value: {
                  executedAt: new Date(data.executed_at),
                  description: data.description,
                  participants: data.participant.map((item) => {
                    const obj = { ...item };
                    obj.realname = item.staff_name;
                    return obj;
                  }),
                },
              },
            });
            const selectStaff = {
              first: [{ realname: data.first_approver_name, staff_sn: data.first_approver_sn }],
              final: [{ realname: data.final_approver_name, staff_sn: data.final_approver_sn }],
              participants: data.participant,
              copy: data.addressee.map((item) => {
                const obj = { ...item };
                obj.realname = item.staff_name;
                return obj;
              }),
            };
            dispatch({
              type: 'searchStaff/saveSelectStaff',
              payload: {
                key: 'selectStaff',
                value: selectStaff,
              },
            });
            dispatch({
              type: 'event/saveData',
              payload: {
                key: 'event',
                value: {
                  id: data.event_id,
                  name: data.event_name,
                },
              },
            });
          },
        },
      });
    } else {
      dispatch({
        type: 'buckle/updateModal',
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.init) {
      const { searchStaff: { selectStaff }, buckle: { info } } = nextProps;
      const { participants } = selectStaff;
      const newParti = participants.map((item) => {
        const obj = { ...item };
        obj.realname = item.staff_name || item.realname;
        return obj;
      });

      this.setState({
        info: {
          ...info,
          participants: newParti,
        },
      });
    }
  }
  remove = (e, item, name) => {
    e.stopPropagation();
    const { searchStaff: { selectStaff }, dispatch } = this.props;
    const { info } = this.state;
    const { participants } = info;
    let newParti = [...participants];
    if (name === 'participants') {
      newParti = participants.filter(its => its.staff_sn !== item.staff_sn);
    }
    const newSelectStaff = { ...selectStaff };
    newSelectStaff[name] = selectStaff[name].filter(its => its.staff_sn !== item.staff_sn);

    dispatch({
      type: 'buckle/saveData',
      payload: {
        key: 'info',
        value: {
          ...info,
          participants: newParti,
        },
      },
    });
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectStaff,
      },
    });
  }
  changePerson = (name, type) => {
    const { history } = this.props;
    this.saveAllData();
    history.push(`/testView2/${name}/${type}`);
  }
  addMore = (name = 'first', type) => {
    const { event } = this.props;
    if (name === 'final') {
      if (!Objecy.keys(event || {}).length) {
        Toast.info('请选择事件，记录分值');
      }
    }
    const { history } = this.props;
    this.saveAllData();
    history.push(`/testView2/${name}/${type}`);
  }
  pointChange = (point, kind, el) => {
    const { optAll, info } = this.state;
    const newOpt = { ...optAll };
    const tempKey = kind === 'point_a' ?
      'pointA' : kind === 'point_b' ?
        'pointB' : kind === 'count' ?
          'count' : '';
    if (el === undefined) {
      newOpt[tempKey] = point;
    } else {
      newOpt[tempKey] = '';
    }
    const newParticipant = info.participants.map((item) => {
      const tmpItem = { ...item };
      if (el === undefined) {
        tmpItem[kind] = point;
      } else
      if (item.staff_sn === el.staff_sn) {
        tmpItem[kind] = point;
      }
      return tmpItem;
    });
    this.setState({
      info: { ...info, participants: newParticipant },
      optAll: newOpt,
    });
  }
  stateChange = (v, key) => {
    const { info } = this.state;
    if (key === 'description') {
      if (v.length > 100) {
        return;
      }
    }
    const newInfo = { ...info };
    newInfo[key] = v;
    this.setState({
      info: newInfo,
    });
  }
  saveAllData = () => {
    const { dispatch, searchStaff: { selectStaff } } = this.props;
    const { info } = this.state;
    const newSelectStaff = { ...selectStaff };
    newSelectStaff.participants = info.participants;
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectStaff,
      },
    });
    dispatch({
      type: 'buckle/saveData',
      payload: {
        key: 'info',
        value: { ...info },
      },
    });
  }
  record = () => {
    const { info } = this.state;
    const { searchStaff: { selectStaff }, event, dispatch, history } = this.props;
    const { first, final, copy } = selectStaff;
    const newCopy = copy.map((item) => {
      const obj = {};
      obj.staff_sn = item.staff_sn;
      obj.staff_name = item.realname;
      return obj;
    });
    const newParticipant = info.participants.map((item) => {
      const obj = {};
      obj.staff_sn = item.staff_sn;
      obj.staff_name = item.realname;
      obj.point_a = item.point_a;
      obj.point_b = item.point_b;
      obj.count = item.count;
      return obj;
    });
    let msg = '';
    msg = event.id === undefined ?
      '请选择事件' : !info.participants.length ?
        '请选择参与人' : !first.length ?
          '请选择初审人' : !final.length ?
            '请选择终审人' : !copy.length ?
              '请选择抄送人' : '';
    if (msg) {
      Toast.fail(msg);
      return;
    }
    dispatch({
      type: 'buckle/recordBuckle',
      payload: {
        data: {
          event_id: event.id,
          participants: newParticipant,
          description: info.description,
          first_approver_sn: first[0].staff_sn,
          first_approver_name: first[0].realname,
          final_approver_sn: final[0].staff_sn,
          final_approver_name: final[0].realname,
          executed_at: moment(info.executedAt).format('YYYY-MM-DD'),
          addressees: newCopy,
        },
        cb: () => {
          history.push('/buckle_list');
        },
      },
    });
  }
  selEvent = () => {
    const { history, dispatch, searchStaff: { selectStaff } } = this.props;
    const { info } = this.state;
    const newSelectStaff = { ...selectStaff };
    newSelectStaff.participants = info.participants;
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectStaff,
      },
    });
    dispatch({
      type: 'buckle/saveData',
      payload: {
        key: 'info',
        value: { ...info },
      },
    });

    history.push('/sel_event');
  }
  infoToast = () => {
    Toast.info('A分范围：0-20,B分范围：0-30');
  }
  render() {
    const { searchStaff: { selectStaff }, event } = this.props;
    const { first, final, copy } = selectStaff;
    const {
      info: { participants, description, executedAt },
      optAll: { pointA, pointB, count },
    } = this.state;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item arrow="horizontal" onClick={this.selEvent}>
                {event && event.name ? event.name : '事件标题'}
              </List.Item>
              <TextareaItem
                placeholder="输入事件描述"
                rows={5}
                labelNumber={5}
                value={description}
                onChange={e => this.stateChange(e, 'description')}
              />
              <div className={style.textinfo}>
                还可输入{100 - description.length}字
              </div>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <DatePicker
              mode="date"
              value={executedAt}
              maxDate={new Date()}
              onChange={e => this.stateChange(e, 'executedAt')}
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
                {(participants || []).map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      value={item}
                      type="2"
                      nameKey="realname"
                      showNum={2}
                      handleDelClick={(e, v) => this.remove(e, v, 'participants')}
                    />
                  );
                })}
                <PersonAdd handleClick={() => this.addMore('participants', 2)} />
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}>
                <Flex.Item>参与人列表</Flex.Item>
                <Flex.Item
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: '#9b9b9b',
                    paddingRight: '0.48rem',
                    backgroundImage: `url(${prompt})`,
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '0.32rem',
                  }}
                  onClick={this.infoToast}
                >分值范围
                </Flex.Item>
              </Flex>
              <Flex className={style.table_head}>
                <Flex.Item className={style.table_item}>姓名</Flex.Item>
                <Flex.Item className={style.table_item}>A分</Flex.Item>
                <Flex.Item className={style.table_item}>B分</Flex.Item>
                <Flex.Item className={style.table_item}>计件</Flex.Item>
              </Flex>
              <div className={style.table_body}>
                <Flex>
                  <Flex.Item className={style.table_item}>全部操作</Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem
                      value={pointA}
                      onChange={e => this.pointChange(e, 'point_a')}
                    />
                  </Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem
                      value={pointB}
                      onChange={e => this.pointChange(e, 'point_b')}
                    />
                  </Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem
                      value={count}
                      onChange={e => this.pointChange(e, 'count')}
                    />
                  </Flex.Item>
                </Flex>
                {(participants || []).map((item, i) => {
                  const idx = i;
                  return (
                    <Flex key={idx}>
                      <Flex.Item className={style.table_item}>{item.realname}</Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.point_a}
                          onChange={e => this.pointChange(e, 'point_a', item)}
                        />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.point_b}
                          onChange={e => this.pointChange(e, 'point_b', item)}
                        />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem
                          value={item.count}
                          onChange={e => this.pointChange(e, 'count', item)}
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
                className={style.person_list}
                wrap="wrap"
              >
                {(first || []).map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      value={item}
                      nameKey="realname"
                      showNum={2}
                      handleClick={() => this.changePerson('first', 1)}
                      handleDelClick={(e, v) => this.remove(e, v, 'first')}
                    />
                  );
                })}
                {first && (!first.length) ? <PersonAdd handleClick={() => this.addMore('first', 1)} /> : null}
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
                {(final || []).map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      value={item}
                      nameKey="realname"
                      showNum={2}
                      handleClick={() => this.changePerson('final', 1)}
                      handleDelClick={(e, v) => this.remove(e, v, 'final')}
                    />
                  );
                })}
                {final && (!final.length) ? <PersonAdd handleClick={() => this.addMore('final', 1)} /> : null}
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
                {(copy || []).map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      value={item}
                      nameKey="realname"
                      showNum={2}
                      type="2"
                      handleDelClick={(e, v) => this.remove(e, v, 'copy')}
                    />
                  );
                })}
                <PersonAdd handleClick={() => this.addMore('copy', 2)} />
              </Flex>
            </div>
          </WingBlank>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button
                type="primary"
                onClick={this.record}
              >提交
              </Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

