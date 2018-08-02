import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { Flex, WhiteSpace, WingBlank } from 'antd-mobile';
import moment from 'moment';
import { Group } from '../../../common/ListView';
import { PersonIcon } from '../../../components/index.js';
import { userStorage } from '../../../utils/util';

import style from '../index.less';
@connect(({ ranking }) => ({
  group: ranking.group,
}))
export default class RankingGroup extends React.Component {
  state = {
    userInfo: {},
    height: document.documentElement.clientHeight,

  }

  componentWillMount() {
    const { dispatch } = this.props;
    const newInfo = userStorage('userInfo');
    this.setState({
      userInfo: newInfo,
    }, () => {
      dispatch({
        type: 'ranking/getAuthorityGroup',
      });
    });
  }
  componentDidMount() {
    const htmlDom = ReactDOM.findDOMNode(this.ptr);
    const offetTop = htmlDom.getBoundingClientRect().top;
    const hei = this.state.height - offetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
  }
  render() {
    const { group } = this.props;
    const authGroup = group.auth_group;
    const statisGroup = group.statis_group;
    const { userInfo = {} } = this.state;
    const datetime = moment(new Date()).format('YYYY-MM');
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.header_info}>
              <div className={style.ranking_user_info}>
                <PersonIcon
                  value={userInfo}
                  footer={false}
                  nameKey="realname"
                  itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
                />
                <div>
                  <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
                  <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{userInfo.department && userInfo.department.full_name}/{userInfo.brand && userInfo.brand.name}</p>
                </div>
              </div>
            </div>
          </WingBlank>
        </Flex.Item>
        <Flex.Item
          className={style.content}
          ref={(e) => { this.ptr = e; }}
          style={{ overflow: 'auto', height: this.state.height }}
        >
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            {authGroup && authGroup.length ?
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px', color: 'rgb(100,100,100)' }}>我的分组</p> : null}
            <Group
              dataSource={authGroup || []}
              heightNone
              datetime={datetime}
              url="/ranking"
            />
            {statisGroup && statisGroup.length ?
              <p style={{ padding: '0.26667rem 0.48rem', fontSize: '14px', color: 'rgb(100,100,100)' }}>可见分组</p> : null}
            <Group
              dataSource={statisGroup || []}
              heightNone
              url="/opt_ranking"
              datetime={datetime}
            />
          </WingBlank>
        </Flex.Item>

      </Flex>
    );
  }
}
