import React from 'react';
import {
  connect,
} from 'dva';
import { List, TextareaItem, WingBlank, WhiteSpace, Button } from 'antd-mobile';

import style from '../index.less';
import styles from '../../common.less';

@connect(({ buckle }) => ({ buckle }))
export default class OperateReason extends React.Component {
  constructor(props) {
    super(props);
    const { match } = props;
    const { id } = match.params;
    this.state = {
      id,
      remark: '',
    };
  }

  stateChange = (v, key) => {
    if (key === 'remark') {
      if (v.length > 100) { return; }
    }
    this.setState({
      [key]: v,
    });
  }

  withDraw = () => {
    const { dispatch, history } = this.props;
    const { id, remark } = this.state;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: {
        data: {
          id,
          params: {
            remark,
          },
        },
        cb: () => {
          history.goBack(-1);
        },
      },
    });
  }

  render() {
    const { remark } = this.state;
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="md" />
          <WingBlank className={style.parcel}>
            <List>
              <List.Item>
                撤回理由
              </List.Item>
              <TextareaItem
                placeholder="输入撤回理由"
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
            <Button type="primary" onClick={this.withDraw}>撤回</Button>
          </div>
        </div>
      </div>
    );
  }
}

