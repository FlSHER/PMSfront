import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, Button, WhiteSpace } from 'antd-mobile';
import { RecordPreview } from '../../../common/ListView';
import { scrollToAnchor, getUrlParams } from '../../../utils/util';

import style from '../index.less';
import styles from '../../common.less';

@connect(({ record }) => ({
  record,
}))

export default class Preview extends React.Component {
  componentWillMount() {
    const { location: { search }, dispatch, record: { records } } = this.props;
    this.urlParams = getUrlParams(search);
    const { id } = this.urlParams;
    if (id !== undefined && !(records && records.length)) {
      dispatch({
        type: 'buckle/getLogGroupDetail',
        payload: {
          eventId: id,
          cb: (detail) => {
            dispatch({
              type: 'record/saveRecordInfo',
              payload: { value: detail },
            });
            dispatch({
              type: 'submit/saveSubmitInfo',
              payload: { value: detail },
            });
          },
        },
      });
    }
  }

  componentDidMount() {
    const { location } = this.props;
    const { hash } = location;
    const link = hash ? hash.slice(hash.indexOf('#') + 1) : '';
    scrollToAnchor(link);
  }

  getCount = () => {
    const { record: { participants } } = this.props;
    let count = 0;
    Object.keys(participants || {}).forEach((key) => {
      count += participants[key].length;
    });
    return count;
  }

  pointRedirect = (e, i) => {
    e.stopPropagation();
    const { history, dispatch } = this.props;
    sessionStorage.eventIndex = i;
    dispatch({
      type: 'record/saveEventKey',
      payload: i,
    });
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
    const { history, dispatch, record: { records } } = this.props;
    dispatch({
      type: 'record/saveEventKey',
      payload: records.length,
    });
    sessionStorage.eventIndex = records.length;
    history.push('/record_point');
  }

  nextStep = () => {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'record/saveEventKey',
      payload: 0,
    });
    history.push('/buckle_submit');
  }

  render() {
    const { record: { records } } = this.props;
    const count = this.getCount();
    const extra = [
      {
        text: '查看详情',
        style: { backgroundColor: 'rgb(199,199,199)', minWidth: '2.133rem', color: 'white', fontSize: '12px' },
        onPress: 'pointRedirect',
      },
      {
        text: '删除',
        style: { backgroundColor: 'rgb(218,81,85)', minWidth: '1.6rem', color: 'white', fontSize: '12px', borderTopRightRadius: '2px' },
        onPress: 'deleteEventItem',
      },
    ];
    return (
      <div
        className={styles.con}
      >
        <div className={styles.header}>
          <WingBlank>
            <div id="event" className={style.all_info}>
              <div className={style.left}>
                <span>事件数量：{records.length}</span>
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
                    color: '#000',
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
            {records.map((item, i) => {
              const key = i;
              const newExtra = extra.map((_) => {
                const obj = { ..._ };
                obj.onPress = e => this[_.onPress](e, i);
                return obj;
              });
              return (
                <React.Fragment key={key}>
                  <WhiteSpace />
                  <RecordPreview
                    extra={newExtra}
                    handleClick={e => this.pointRedirect(e, i)}
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

