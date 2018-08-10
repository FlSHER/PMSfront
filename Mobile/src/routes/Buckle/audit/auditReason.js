import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, WingBlank, WhiteSpace, Button, Flex, InputItem } from 'antd-mobile';

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
export default class AuditReason extends React.Component {
  constructor(props) {
    if (!Object.keys(props.detail).length) {
      props.history.goBack(-1);
    }
    super(props);
    const { match } = props;
    const { type, state, level } = match.params;
    this.state = {
      type,
      state,
      level,
      remark: '',
      point: {
        recorder_point: '',
        first_approver_point: '',
      },
    };
  }

  setIntegral = (v, key) => {
    const { point } = this.state;
    const newPoint = { ...point };
    newPoint[key] = v;

    this.setState({
      point: newPoint,
    });
  }
  stateChange = (v, key) => {
    if (key === 'remark') {
      if (v.length > 100) { return; }
    }
    this.setState({
      [key]: v,
    });
  }
  doAudit = () => {
    const { type, state, remark, point, level } = this.state;
    const { dispatch, history, detail } = this.props;
    if (state === 'no') {
      dispatch({
        type: 'buckle/buckleReject',
        payload: {
          data: {
            param: { remark },
            event_id: detail.id,
          },
          cb: () => {
            history.goBack(Number(level));
          },
        },
      });
    } else if (type === '0') { // 初审
      dispatch({
        type: 'buckle/firstApprove',
        payload: {
          data: {
            param: { remark },
            event_id: detail.id,
          },
          cb: () => {
            history.go(level);
          },
        },
      });
    } else if (type === '1') {
      dispatch({
        type: 'buckle/finalApprove',
        payload: {
          data: {
            param: {
              final_approve_remark: remark,
              first_approver_point: point.first_approver_point,
              recorder_point: point.recorder_point,
            },
            event_id: detail.id,
          },
          cb: () => {
            history.go(level);
          },
        },
      });
    }
  }
  render() {
    const { remark, point, type, state } = this.state;
    const { detail } = this.props;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="md" />
          {type === '1' && state === 'yes' ? (
            <WingBlank className={style.parcel}>
              <div className={style.players}>
                <Flex className={style.title}> 配置分值</Flex>
                <Flex className={style.table_head}>
                  <Flex.Item className={style.table_item} style={{ borderLeft: 'none' }}>名称</Flex.Item>
                  <Flex.Item className={style.table_item}>姓名</Flex.Item>
                  <Flex.Item className={style.table_item} style={{ borderRight: 'none' }}>B分</Flex.Item>
                </Flex>
                <div className={style.table_body}>
                  {person.map((item, i) => {
                    const idx = i;
                    return (
                      <Flex key={idx}>
                        <Flex.Item className={style.table_item}>{item.name}</Flex.Item>
                        <Flex.Item className={style.table_item}>{detail[item.value]}</Flex.Item>
                        <Flex.Item className={style.table_item}>
                          <InputItem
                            type="number"
                            value={point[item.key]}
                            onChange={v => this.setIntegral(v, item.key)}
                          />
                        </Flex.Item>
                      </Flex>);
                  })
                  }
                </div>
              </div>
            </WingBlank>
          ) : null}

          <WhiteSpace size="sm" />
          <WingBlank className={style.parcel}>
            <List>
              <List.Item>
                审批意见
              </List.Item>
              <TextareaItem
                placeholder="输入事件描述"
                rows={5}
                labelNumber={5}
                value={remark}
                onChange={v => this.stateChange(v, 'remark')}
              />
              <div className={style.textinfo}>
                还可输入{100 - remark.length}字
              </div>
            </List>
          </WingBlank>
          <WhiteSpace size="sm" />

        </div>
        <div className={styles.footer}>
          <div className={style.opt}>
            {state === 'yes' ? <Button type="primary" onClick={this.doAudit}>通过</Button> : <Button type="primary" onClick={this.doAudit}>驳回</Button>}
          </div>
        </div>
      </div>
    );
  }
}

