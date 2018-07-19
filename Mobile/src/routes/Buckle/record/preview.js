import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Button, WhiteSpace } from 'antd-mobile';
import { RecordPreview } from '../../../common/ListView';
import { scrollToAnchor } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';

@connect(({ event, record }) => ({
  event,
  record,
}))

export default class PointRanking extends React.Component {
  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    const link = hash ? hash.slice(hash.indexOf('#') + 1) : '';
    scrollToAnchor(link);
  }

  redirectEvent = () => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'record/saveEventKey',
      payload: -1,
    });
    history.push('/record_point');
  }

  render() {
    const { record: { event, eventStaff } } = this.props;
    const count = Object.keys(eventStaff || {}).length;
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
          <WingBlank>
            <div id="event" className={style.all_info}>
              <div className={style.left}>
                <span>事件数量：{event.length}</span>
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
            {event.map(item => (
              <React.Fragment key={item.id}>
                <WhiteSpace />
                <RecordPreview
                  value={item}
                />
              </React.Fragment>

            ))}
          </WingBlank>
        </div>
        <div className={styles.footer}>
          <WingBlank>
            <div className={style.opt}>
              <Button
                type="primary"
                onClick={this.next}
              >下一步
              </Button>
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}

