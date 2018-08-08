import React from 'react';
import { Steps, Button, Icon } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import style from './index.less';

const { Step } = Steps;

@connect(({ buckle }) => ({
  buckleInfo: buckle.buckleGropusDetails,
}))
export default class BuckleSuccess extends React.PureComponent {
  componentWillMount() {
    this.fetch();
  }

  fetch = () => {
    const { dispatch } = this.props;
    const { params } = this.props.match;
    const { id } = params;
    dispatch({
      type: 'buckle/fetchBuckleGroupsInfo',
      payload: { id },
    });
  }

  makeCurrent = (statusId) => {
    let current = 1;
    switch (statusId) {
      case 0:
        current = 1;
        break;
      case 1:
        current = 2;
        break;
      case 2:
        current = 3;
        break;
      default:
        break;
    }
    return current;
  }

  render() {
    const { buckleInfo } = this.props;
    const { params } = this.props.match;
    const { id } = params;
    const { user } = window;
    const info = buckleInfo[id] || {};
    const first = (user && user.realname === info.first_approver_name ? '我' : info.first_approver_name) || null;
    const final = (user && user.realname === info.final_approver_name ? '我' : info.final_approver_name) || null;
    const current = id ? this.makeCurrent(info.status_id) : null;
    const firstTitle = (
      <React.Fragment>
        初审<span className={style.userName}>{first && `（${first}）`}</span>
      </React.Fragment>
    );
    const finalTitle = (
      <React.Fragment>
        终审<span className={style.userName}>{final && `（${final}）`}</span>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={style.content}>
          <div className={style.success}>
            <Icon type="check-circle" />
            <p>提交成功</p>
          </div>
          <Steps progressDot current={current}>
            <Step title="提交成功" />
            <Step title={firstTitle} />
            <Step title={finalTitle} />
            <Step title="完成" />
          </Steps>
          <div className={style.btn}>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.goBack(-1);
              }}
            >再记一单
            </Button>
            <Button
              onClick={() => {
                this.props.dispatch({
                  type: 'tabs/save',
                  payload: {
                    store: 'reward',
                    value: '2',
                  },
                  callBack: this.props.dispatch(routerRedux.replace('/reward/my')),
                });
              }}
            >查看奖扣
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

