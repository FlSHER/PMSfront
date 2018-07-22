import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, Button, DatePicker } from 'antd-mobile';
import { PersonIcon, PersonAdd } from '../../../components/index.js';
import { scrollToAnchor } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';
@connect(({ submit, record }) => ({
  submit,
  record,
}))
export default class BuckleRecord extends React.Component {
  state = {
    title: '',
    remark: '',
    executed_at: '',
  }
  componentWillMount() {
    const { record: { eventIndex }, history } = this.props;
    if (eventIndex === -1) {
      history.replace('/buckle_preview');
    }
    this.initInfo();
  }

  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    const link = hash ? hash.slice(hash.indexOf('#') + 1) : '';
    scrollToAnchor(link);
  }

  initInfo =() => {
    const { submit: { info } } = this.props;
    this.setState({
      info,
    });
  }

  remove = (e, item, name) => {
    e.stopPropagation();
    const { searchStaff: { selectStaff }, dispatch } = this.props;
    const { info } = this.state;
    const { participants } = info;
    let newParti = [...participants];
    if (name === 'participants') {
      newParti = participants.filter(its => its.staff_sn !== item.staff_sn);
      this.setState({
        info: {
          ...info,
          participants: newParti,
        },
      });
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
    history.push(`/sel_person2/${name}/${type}/sumbit`);
  }

  addMore = (name, type) => {
    const { history } = this.props;
    this.saveAllData();
    history.replace(`/buckle_submit#${name}`);
    history.push(`/sel_person2/${name}/${type}/submit`);
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
    const { info } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'submit/saveData',
      payload: {
        key: 'info',
        value: info,
      },
    });
  }

  record = () => {
    const {
      record: { events },
      submit: { addressees, final, first },
      dispatch, history,
    } = this.props;
    const newAddressees = addressees.map((item) => {
      const obj = {
        staff_sn: item.staff_sn,
        staff_name: item.staff_sn,
      };
      return obj;
    });
    const submitInfo = this.state.info;
    const params = {
      events,
      title: 'xx',
      remark: '',
      first_approver_sn: first.staff_sn,
      first_approver_name: first.realname,
      final_approver_sn: final.staff_sn,
      final_approver_name: final.staff_name,
      ...submitInfo,
      addressees: newAddressees,
    };
    console.log('params', params);
    dispatch({
      type: 'submit/recordBuckle',
      payload: {
        data: params,
        cb: () => {
          history.replace('/home');
        },
      },
    });
  }

  clearModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buckle/clearModal',
    });
    dispatch({
      type: 'event/clearModal',
    });
    dispatch({
      type: 'searchStaff/clearSelectStaff',
    });
  }


  render() {
    const { submit } = this.props;
    const { first, final, addressees } = submit;
    const {
      info,
    } = this.state;

    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WingBlank className={style.parcel}>
            <DatePicker
              mode="date"
              value={new Date(info.executed_at)}
              maxDate={new Date()}
              onChange={e => this.stateChange(moment(e).format('YYYY-MM-DD'), 'executed_at')}
            >
              <List.Item arrow="horizontal">事件时间</List.Item>
            </DatePicker>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players} id="first">
              <Flex className={style.title} > 初审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                {!first ?
                  <PersonAdd handleClick={() => this.addMore('first', 1)} /> : (
                    <PersonIcon
                      value={first}
                      nameKey="realname"
                      showNum={2}
                      handleClick={() => this.changePerson('first', 1)}
                      handleDelClick={(e, v) => this.remove(e, v, 'first')}
                    />
                  )}
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players} id="final">
              <Flex className={style.title} > 终审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                {!final ? <PersonAdd handleClick={() => this.addMore('final', 1)} /> : (
                  <PersonIcon
                    value={final}
                    nameKey="staff_name"
                    showNum={2}
                    handleClick={() => this.changePerson('final', 1)}
                    handleDelClick={(e, v) => this.remove(e, v, 'final')}
                  />
                  )}
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <div className={style.players} id="copy">
              <Flex className={style.title} > 抄送人</Flex>
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
                      nameKey="realname"
                      showNum={2}
                      type="2"
                      handleDelClick={(e, v) => this.remove(e, v, 'addressees')}
                    />
                  );
                })}
                <PersonAdd handleClick={() => this.addMore('addressees', 2)} />
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="lg" />
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

