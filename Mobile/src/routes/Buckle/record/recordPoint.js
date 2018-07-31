import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank, WhiteSpace, Button, Toast } from 'antd-mobile';
import { PersonIcon, PersonAdd } from '../../../components/index.js';
import Input from '../../../components/General/Input/input.js';
import { userStorage, scrollToAnchor } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';
import prompt from '../../../assets/prompt.svg';
@connect(({ buckle, loading, record }) => ({
  buckle,
  loading,
  record,
}))
export default class BuckleRecord extends React.Component {
  state = {
    optAll: {
      pointA: '',
      pointB: '',
      count: 1,
    },
    info: {
      description: '',
      participants: [],
      event_id: null,
      name: '',
    },
    event: {},
  }

  componentWillMount() {
    const { record: { eventIndex }, history } = this.props;
    if (eventIndex === -1) {
      history.goBack(-1);
    }
    this.initInfo();
  }

  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    const link = hash ? hash.slice(hash.indexOf('#') + 1) : '';
    scrollToAnchor(link);
  }

  initInfo = () => {
    const { record: { events, eventIndex, optAll, eventAll } } = this.props;
    const initInfo = {
      description: '',
      participants: [],
      event_id: null,
      name: '',
    };
    const info = { ...events[eventIndex] || initInfo };
    const optItem = { ...optAll[eventIndex] };
    const event = { ...eventAll[eventIndex] };
    const { participants } = info;
    const newParticipant = this.initParticipants(participants, optItem, event);
    info.participants = newParticipant;
    this.setState({
      info,
      optAll: optItem,
      event,
    });
  }

  initParticipants = (participants, optAll, event) => {
    const newParticipant = (participants || []).map((item) => {
      const obj = { ...item };
      obj.realname = item.staff_name || item.realname;
      obj.point_a = (item.point_a === '' || item.point_a === undefined) ?
        (optAll.pointA !== '' ? Number(optAll.pointA) : Number(event.point_a_default)) : item.point_a;
      obj.point_b = (item.point_b === '' || item.point_b === undefined) ?
        (optAll.pointB !== '' ? Number(optAll.pointB) : Number(event.point_b_default)) : item.point_b;
      obj.count = item.count === undefined ? optAll.count : item.count;
      return obj;
    });
    return newParticipant;
  }

  remove = (e, item) => {
    const { info } = this.state;
    const { participants } = info;
    const newParticipants = participants.filter(its => its.staff_sn !== item.staff_sn);
    this.setState({
      info: {
        ...info,
        participants: newParticipants,
      },
    });
  }

  changePerson = (name, type) => {
    const { history } = this.props;
    this.saveAllData();
    history.push(`/sel_person2/${name}/${type}/record`);
  }

  addMore = (name, type) => {
    const { history } = this.props;
    this.saveAllData();
    history.replace(`/record_point#${name}`);
    history.push(`/sel_person2/${name}/${type}/record`);
  }

  savePointData = (newPoint, kind, el) => {
    const { info, optAll, event } = this.state;
    let error = false;
    if (kind !== 'count' && ((Number(newPoint) > Number(event[`${kind}_max`])) || (Number(newPoint) < Number(event[`${kind}_min`])))) {
      error = true;
    }
    const newOpt = { ...optAll };
    const tempKey = kind === 'point_a' ?
      'pointA' : kind === 'point_b' ?
        'pointB' : kind === 'count' ?
          'count' : '';

    if (el === undefined) {
      newOpt[tempKey] = newPoint;
    } else {
      newOpt[tempKey] = '';
    }
    newOpt[`${kind}_error`] = error;
    const newParticipant = info.participants.map((item) => {
      const tmpItem = { ...item };
      if (el === undefined) {
        tmpItem[kind] = newPoint;
        tmpItem[`${kind}_error`] = error;
      } else
      if (item.staff_sn === el.staff_sn) {
        tmpItem[kind] = newPoint;
        tmpItem[`${kind}_error`] = error;
      }
      return tmpItem;
    });
    this.setState({
      info: { ...info, participants: newParticipant },
      optAll: newOpt,
    });
  }

  // 验证数字
  validNumer = (point, kind, el) => {
    const newPoint = 0;
    if (point && !/^(-?\d+)(\.\d+)?$/.test(point)) {
      this.savePointData(newPoint, kind, el);
    }
  }

  pointChange = (point, kind, el) => {
    // 验证整数;
    if (kind === 'count' && point && !/^\d+$/.test(point)) {
      return;
    }
    // if (point && point !== '-' && !/^(-?\d+)(\.\d+)?$/.test(point)) {
    //   return;
    // }
    // const newPoint = this.clearNoNum(point);
    const newPoint = point;
    this.savePointData(newPoint, kind, el);
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
    const { dispatch } = this.props;
    const { info } = this.state;
    const { participants } = info;
    const newParticipants = this.convertPointToInt(participants);
    dispatch({
      type: 'record/saveEvents',
      payload: {
        index: sessionStorage.getItem('eventIndex'),
        value: { ...info, participants: newParticipants },
      },
    });
    dispatch({
      type: 'record/saveEventStaff',
      payload: {
        value: newParticipants,
        index: sessionStorage.getItem('eventIndex'),
      },
    });
  }

  record = () => {
    const { history, dispatch } = this.props;
    const { info } = this.state;
    if (this.validHasError()) {
      return;
    }
    const { participants } = info;
    const newParticipants = this.convertPointToInt(participants);
    this.saveAllData();
    dispatch({
      type: 'record/saveRecords',
      payload: {
        key: 'records',
        index: sessionStorage.getItem('eventIndex'),
        value: { ...info, participants: newParticipants },
      },
    });

    history.goBack(-1);
  }

  convertPointToInt =(participants) => {
    const newParticipants = participants.map((item) => {
      const obj = { ...item };
      const point = ['point_a', 'point_b'];
      point.forEach((key) => {
        const value = Number(item[key]);
        if (Math.floor(item[key]) === value) {
          obj[key] = value;
        }
      });
      return obj;
    });
    return newParticipants;
  }

  validHasError = () => {
    const { info } = this.state;
    const eventId = info.event_id;
    const { participants } = info;
    let msg = '';
    if (eventId === null) {
      msg = '请选择事件';
    }
    if (!participants && !participants.length) {
      msg = '请选择参与人';
    }
    if (participants.length && this.validPointError()) {
      msg = '请填写正确范围的分数';
    }
    if (msg) {
      Toast.fail(msg);
    }
    return msg;
  }

  validPointError = () => {
    const { info: { participants } } = this.state;
    let hasError = false;
    participants.forEach((item) => {
      hasError = item.point_a_error || item.point_b_error;
      if (hasError) {
        return true;
      }
    });
    return hasError;
  }

  selEvent = () => {
    const { history } = this.props;
    this.saveAllData();
    history.replace('/record_point#event');
    history.push('/sel_event2/record');
  }

  addMySelf = () => {
    const { info, optAll } = this.state;
    const userInfo = userStorage('userInfo');
    const { participants } = info;
    const newParticipants = [...participants];
    if (participants.filter(item => item.staff_sn === userInfo.staff_sn).length) {
      return;
    }
    const myself = {
      staff_sn: userInfo.staff_sn,
      staff_name: userInfo.realname,
      point_a: optAll.pointA ? Number(optAll.pointA) : Number(info.point_a_default),
      point_b: optAll.pointB ? Number(optAll.pointB) : Number(info.point_b_default),
      count: optAll.count ? optAll.count : 1,
    };
    newParticipants.push(myself);
    this.setState({
      info: {
        ...info,
        participants: newParticipants,
      },
    });
  }

  infoToast = () => {
    const { event } = this.state;
    if (event.id) {
      Toast.info(
        <div>
          <p>A分范围：
            {event.point_a_min} 至 {event.point_a_max}
          </p>
          <p>B分范围：
            {event.point_b_min} 至 {event.point_b_max}
          </p>
        </div>);
    } else {
      Toast.info('请先选择事件');
    }
  }

  render() {
    const {
      info: { participants, description, name },
      optAll,
      event,
    } = this.state;
    const rangeA = {
      min: event.point_a_min,
      max: event.point_a_max,
    };
    const rangeB = {
      min: event.point_b_min,
      max: event.point_b_max,
    };
    let tmpPointA = participants[0] ? participants[0].point_a : '';
    let tmpPointB = participants[0] ? participants[0].point_b : '';
    let tmpCount = participants[0] ? participants[0].count : '';
    const newTempA = (participants || []).filter(item => item.point_a !== tmpPointA);
    if (newTempA.length) {
      tmpPointA = '';
    }
    const newTempB = (participants || []).filter(item => item.point_b !== tmpPointB);
    if (newTempB.length) {
      tmpPointB = '';
    }
    if ((participants || []).filter(item => item.count !== tmpCount).length) {
      tmpCount = '';
    }

    // this.state.optAll.pointA = tmpPointA;
    // this.state.optAll.pointB = tmpPointB;
    // this.state.optAll.count = tmpCount || 1;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />
          <WingBlank className={[style.parcel, style.bottom].join(' ')}>
            <List>
              <List.Item arrow="horizontal" onClick={this.selEvent}>
                {name ? <span id="event">{name}</span> : <span style={{ color: 'rgb(150,150,150)' }}>请选择事件</span>}
              </List.Item>
            </List>
          </WingBlank>
          <WingBlank className={style.parcel}>
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
          </WingBlank>
          <WhiteSpace size="sm" />
          <div style={{ ...(!name ? { display: 'none' } : null) }}>
            <WhiteSpace size="sm" />
            <WingBlank className={style.parcel}>
              <div className={style.players}>
                <Flex className={style.title} id="participants">
                  <Flex.Item >参与人</Flex.Item>
                  <Flex.Item
                    style={{
                      textAlign: 'right',
                      fontSize: '12px',
                      color: 'rgb(24, 116, 208)',
                    }}
                    onClick={this.addMySelf}
                  >添加本人
                  </Flex.Item>
                </Flex>
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
                        nameKey="staff_name"
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
              <div className={style.players} style={{ paddingBottom: '0.48rem' }}>
                <Flex className={style.title}>
                  <Flex.Item>事件配置</Flex.Item>
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
                  <Flex.Item className={style.table_item}>单次A分</Flex.Item>
                  <Flex.Item className={style.table_item}>单次B分</Flex.Item>
                  <Flex.Item className={style.table_item}>次数</Flex.Item>
                </Flex>
                <div className={style.table_body}>
                  <Flex>
                    <Flex.Item className={[style.table_item, style.opt_all].join(' ')} >全部操作</Flex.Item>
                    <Flex.Item className={[style.table_item, style.opt_all].join(' ')} >
                      <Input
                        value={tmpPointA}
                        range={rangeA}
                        style={{ background: '#badcff', ...(optAll.point_a_error ? { color: 'red' } : null) }}
                        onChange={v => this.pointChange(v, 'point_a')}
                        floatNumber={2}
                      />
                    </Flex.Item>
                    <Flex.Item className={[style.table_item, style.opt_all].join(' ')} >
                      <Input
                        value={tmpPointB}
                        range={rangeB}
                        style={{ background: '#badcff', ...(optAll.point_b_error ? { color: 'red' } : null) }}
                        onChange={v => this.pointChange(v, 'point_b')}
                        floatNumber={2}
                      />
                    </Flex.Item>
                    <Flex.Item className={[style.table_item, style.opt_all].join(' ')}>
                      <Input
                        value={tmpCount}
                        style={{ background: '#badcff', ...(optAll.count_error ? { color: 'red' } : null) }}
                        onChange={v => this.pointChange(v, 'count')}
                      />
                    </Flex.Item>
                  </Flex>
                  {(participants || []).map((item, i) => {
                    const idx = i;
                    return (
                      <Flex key={idx}>
                        <Flex.Item className={style.table_item}>{item.staff_name}</Flex.Item>
                        <Flex.Item className={style.table_item}>
                          <Input
                            value={`${item.point_a}`}
                            range={rangeA}

                            style={{ ...(item.point_a_error ? { color: 'red' } : null) }}
                            onChange={v => this.pointChange(v, 'point_a', item)}
                            floatNumber={2}
                          />
                        </Flex.Item>
                        <Flex.Item className={style.table_item}>
                          <Input
                            value={`${item.point_b}`}
                            style={{ ...(item.point_b_error ? { color: 'red' } : null) }}
                            onChange={v => this.pointChange(v, 'point_b', item)}
                          />
                        </Flex.Item>
                        <Flex.Item className={style.table_item}>
                          <Input
                            value={item.count}
                            range={rangeA}
                            style={{ ...(item.count_error ? { color: 'red' } : null) }}
                            onChange={v => this.pointChange(v, 'count', item)}
                          />
                        </Flex.Item>
                      </Flex>);
                  })
                  }
                </div>
              </div>
            </WingBlank>
          </div>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button
                type="primary"
                onClick={this.record}
              >确定
              </Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

