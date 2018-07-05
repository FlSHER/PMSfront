import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
} from 'dva';
import { Flex, WhiteSpace, WingBlank, List } from 'antd-mobile';
import moment from 'moment';
import { PersonIcon } from '../../../components/index.js';
import { userStorage } from '../../../utils/util';

import style from '../index.less';
@connect(({ ranking }) => ({
  group: ranking.group,
}))
export default class RankingGroup extends React.Component {
  state = {
    // shortModal: false,
    height: document.documentElement.clientHeight,
    userInfo: {},
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
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(() => this.setState({
      height: hei,
    }), 0);
  }

  render() {
    const { group } = this.props;
    const { userInfo } = this.state;
    const datetime = moment(new Date()).format('YYYY-MM-DD');
    return (
      <Flex direction="column">
        <Flex.Item className={style.header}>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <div className={style.ranking_user_info}>
              <PersonIcon
                value={userInfo}
                footer={false}
                nameKey="realname"
                itemStyle={{ marginBottom: 0, marginRight: '0.5333rem' }}
              />
              <div>
                <p style={{ fontSize: '14px' }}>{userInfo.realname}({userInfo.staff_sn})</p>
                <p style={{ fontSize: '12px', marginTop: '0.26667rem' }}>{userInfo.department.full_name}/{userInfo.brand.name}</p>
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />


        </Flex.Item>
        <Flex.Item className={style.header}>
          <WingBlank size="lg">
            <List className={style.my_list}>
              <List.Item>排名筛选</List.Item>
            </List>
          </WingBlank>
        </Flex.Item>

        <Flex.Item className={style.content}>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <List
              className={style.my_list}
              style={{ height: this.state.height, overflow: 'auto' }}
              ref={(el) => { this.ptr = el; }}
            >
              {(group || []).map((item, i) => {
                const idx = i;
                return (
                  <List.Item
                    arrow="horizontal"
                    onClick={() => this.props.history.push(`/ranking?group_id=${item.id}&datetime=${datetime}`)}
                    key={idx}
                  >{item.name}
                  </List.Item>
                );
              })}
            </List>
          </WingBlank>
        </Flex.Item>

      </Flex>
    );
  }
}
