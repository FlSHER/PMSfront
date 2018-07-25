import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Button, WhiteSpace, Flex } from 'antd-mobile';
import { RecordPreview } from '../../../common/ListView';
import { userStorage } from '../../../utils/util';


import style from '../index.less';
import styles from '../../common.less';

@connect(({ buckle, record }) => ({
  record,
  detail: buckle.groupDetail,
}))

export default class EventPreview extends React.Component {
  state={
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
    const { detail: { logs = [] } } = this.props;
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

  render() {
    const { detail } = this.props;
    const { userInfo } = this.state;
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
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
          <WingBlank>
            <div id="event" className={style.all_info}>
              <div className={style.left}>
                <span>事件数量：{logs.length}</span>
                <span>总人次：{count}</span>
              </div>
            </div>
          </WingBlank>
        </div>
        <div className={styles.con_content}>
          <WingBlank>
            {logs.map((item, i) => {
              const key = i;
              return (
                <React.Fragment key={key}>
                  <WhiteSpace />
                  <RecordPreview
                    // handleClick={e => this.pointRedirect(e, i)}
                    value={item}
                  />
                </React.Fragment>
              );
            }
            )}
          </WingBlank>
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

