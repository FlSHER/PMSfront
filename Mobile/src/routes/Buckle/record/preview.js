import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Button, WhiteSpace } from 'antd-mobile';
import { RecordPreview } from '../../../common/ListView';
import { scrollToAnchor } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';

@connect(({ record }) => ({
  record,
}))

export default class PointRanking extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    const link = hash ? hash.slice(hash.indexOf('#') + 1) : '';
    scrollToAnchor(link);
  }

  getCount = () => {
    const { record: { participants } } = this.props;
    let count = 0;
    Object.keys(participants || {}).forEach((item) => {
      count += item.length;
    });
    return count;
  }

  pointRedirect = (e, i) => {
    e.stopPropagation();
    const { history } = this.props;
    sessionStorage.eventIndex = i;
    history.push('/record_point');
  }

  deleteEventItem = (e, i) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'record/deleteEvents',
      payload: {
        index: i,
      },
    });
  }

  redirectEvent = () => {
    const { history, dispatch, record: { events } } = this.props;
    dispatch({
      type: 'record/saveEventKey',
      payload: events.length,
    });
    sessionStorage.eventIndex = events.length;
    history.push('/record_point');
  }

  nextStep = () => {
    const { history } = this.props;
    history.push('/buckle_submit');
  }

  render() {
    const { record: { events } } = this.props;
    const count = this.getCount();
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
          <WingBlank>
            <div id="event" className={style.all_info}>
              <div className={style.left}>
                <span>事件数量：{events.length}</span>
                <span>总人次：{count}</span>
              </div>
              <div className={style.add}>
                <Button
                  type="ghost"
                  inline
                  size="small"
                  onClick={this.redirectEvent}
                  style={{
                    border: '1px dashed rgb(199,199,199)',
                    color: 'rgb(155,155,155)',
                  }}
                >
                  添加事件
                </Button>
              </div>
            </div>
          </WingBlank>
        </div>
        <div className={styles.con_content}>
          <WingBlank>
            {events.map((item, i) => {
              const key = i;
              return (
                <React.Fragment key={key}>
                  <WhiteSpace />
                  <RecordPreview
                    handleClick={e => this.pointRedirect(e, i)}
                    extraClick={e => this.deleteEventItem(e, i)}
                    value={item}
                  />
                </React.Fragment>
              );
            }
            )}
          </WingBlank>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button
                type="primary"
                onClick={this.nextStep}
              >下一步
              </Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

