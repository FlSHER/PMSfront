import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace, Button, DatePicker, TextareaItem } from 'antd-mobile';
import moment from 'moment';
import { PersonIcon, PersonAdd } from '../../../components/index.js';
import { scrollToAnchor } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';
@connect(({ submit, record }) => ({
  submit,
  record,
}))
export default class BuckleRecord extends React.Component {
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
    const { submit: { info } } = this.props;
    console.log('info', info);
    this.setState({
      info,
    });
  }

  remove = (e, item, name, idx) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const person = null;
    const params = {
      key: name,
      value: person,
    };
    if (idx !== undefined) {
      let newPerson = [...this.props.submit[name] || []];
      if (idx === newPerson.length - 1) {
        newPerson = newPerson.slice(0, idx);
      } else {
        newPerson = newPerson.slice(0, idx).concat(newPerson.slice(idx + 1));
      }
      params.value = [...newPerson];
    }
    dispatch({
      type: 'submit/saveData',
      payload: {
        ...params,
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
      record: { records },
      submit: { addressees, final, first },
      dispatch, history,
    } = this.props;
    const newAddressees = addressees.map((item) => {
      const obj = {
        staff_sn: item.staff_sn,
        staff_name: item.realname,
      };
      return obj;
    });
    const submitInfo = this.state.info;
    const params = {
      events: records,
      first_approver_sn: first.staff_sn,
      first_approver_name: first.realname,
      final_approver_sn: final.staff_sn,
      final_approver_name: final.staff_name,
      ...submitInfo,
      addressees: newAddressees,
    };
    dispatch({
      type: 'submit/recordBuckle',
      payload: {
        data: params,
        cb: () => {
          dispatch({
            type: 'submit/clearModal',
          });
          dispatch({
            type: 'record/clearModal',
          });
          history.replace('/submitok');
        },
      },
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
          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <TextareaItem
              title="主题"
              value={info.title}
              placeholder="请输入主题"
              autoHeight
              onChange={v => this.stateChange(v, 'title')}
            />
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank className={[style.parcel, style.nobottom].join(' ')} >
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
            <div className={[style.players, style.nopaddingl].join(' ')} id="copy">
              <Flex className={style.title}>备注</Flex>
              <TextareaItem
                placeholder="输入备注"
                rows={5}
                labelNumber={5}
                value={info.remark}
                onChange={e => this.stateChange(e, 'remark')}
              />
              <div className={style.textinfo}>
                还可输入{100 - info.remark.length}字
              </div>
            </div>
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
                      handleDelClick={(e, v) => this.remove(e, v, 'addressees', idx)}
                    />
                  );
                })}
                <PersonAdd handleClick={() => this.addMore('addressees', 2)} />
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

