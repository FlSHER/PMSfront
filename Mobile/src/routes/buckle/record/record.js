import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, Flex, WingBlank, WhiteSpace, InputItem, Button, DatePicker } from 'antd-mobile';
import { PersonIcon, PersonAdd } from '../../../components/index.js';
import style from '../index.less';
import styles from '../../common.less';

@connect(({ buckle, searchStaff, loading, event }) => ({
  buckle,
  loading,
  searchStaff,
  event: event.event,
}))
export default class BuckleRecord extends React.Component {
  state={
    executed_at: new Date(),
    description: '',
  }
  remove = (item, name) => {
    const { searchStaff: { selectStaff }, dispatch } = this.props;
    const newSelectStaff = { ...selectStaff };
    newSelectStaff[name] = selectStaff[name].filter(its => its.staff_sn !== item.staff_sn);
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectStaff,
      },
    });
  }
  changePerson = (name, type) => {
    this.props.history.push(`/testView2/${name}/${type}`);
  }
  addMore = (name = 'first', type) => {
    this.props.history.push(`/testView2/${name}/${type}`);
  }
  pointChange = () => {

  }
  stateChange = (v, key) => {
    this.setState({
      [key]: v,
    });
  }
  render() {
    const { searchStaff: { selectStaff }, event } = this.props;
    const { first, final, participant, copy } = selectStaff;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="sm" />

          <WingBlank className={style.parcel}>
            <List>
              <List.Item arrow="horizontal" onClick={() => this.props.history.push('/sel_event')}>
                {event && event.name ? event.name : '事件标题'}
              </List.Item>
              <TextareaItem
                placeholder="输入事件描述"
                rows={5}
                labelNumber={5}
                value={this.state.description}
                onChange={e => this.stateChange(e, 'description')}
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
              value={this.state.executed_at}
              onChange={e => this.stateChange(e, 'executed_at')}
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
                {(participant || []).map((item, i) => {
                  const idx = i;
                  return (
                    <PersonIcon
                      key={idx}
                      value={item}
                      type="2"
                      nameKey="realname"
                      showNum={2}
                      handleClick={v => this.remove(v, 'participant')}
                    />
              );
                })}
                <PersonAdd handleClick={() => this.addMore('participant', 2)} />
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
                <Flex>
                  <Flex.Item className={style.table_item}>全部操作</Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem onChange={() => this.pointChange('all', 'point_a')} />
                  </Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem onChange={() => this.pointChange('all', 'point_b')} />
                  </Flex.Item>
                  <Flex.Item className={style.table_item}>
                    <InputItem onChange={() => this.pointChange('all', 'count')} />
                  </Flex.Item>
                </Flex>
                {(participant || []).map((item, i) => {
                  const idx = i;
                  return (
                    <Flex key={idx}>
                      <Flex.Item className={style.table_item}>{item.realname}</Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem onChange={() => this.pointChange('all', 'point_a', item)} />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem onChange={() => this.pointChange('all', 'point_b', item)} />
                      </Flex.Item>
                      <Flex.Item className={style.table_item}>
                        <InputItem onChange={() => this.pointChange('all', 'count', item)} />
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
                    type="1"
                    handleClick={() => this.changePerson('first', 1)}
                  />
            );
              })}
                {!first.length ? <PersonAdd handleClick={() => this.addMore('first', 1)} /> : null}
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
                    type="1"
                    handleClick={() => this.changePerson('final', 1)}

                  />
            );
              })}
                {!final.length ? <PersonAdd handleClick={() => this.addMore('final', 1)} /> : null}
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
                    handleClick={v => this.remove(v, 'copy')}
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
              <Button type="primary">提交</Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

