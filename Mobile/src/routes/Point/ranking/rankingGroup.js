import React from 'react';
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
  render() {
    const { group } = this.props;
    const { userInfo } = this.state;
    const datetime = moment(new Date()).format('YYYY-MM-DD');
    return (
      <Flex direction="column" style={{ height: '100%' }}>
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
          <WingBlank size="lg">
            <List className="my-list">
              <List.Item>排名筛选</List.Item>
            </List>
          </WingBlank>

        </Flex.Item>
        <Flex.Item className={style.content}>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <List className={style.my_list}>
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
