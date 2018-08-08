import React from 'react';
import { Button, WhiteSpace, WingBlank, Flex, List } from 'antd-mobile';
import { PersonIcon } from '../../components/index.js';
import {
  userStorage,
} from '../../utils/util';
import style from '../Point/index.less';

class My extends React.Component {
  toExit = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = `${OA_PATH}/logout?redirect_uri=${OA_PATH}/home`;
  }

  redirectTo = (url) => {
    this.props.history.push(url);
  }

  render() {
    const userInfo = userStorage('userInfo');
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
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <List>
              <List.Item arrow="horizontal" onClick={() => this.redirectTo('/point_statistic')}>我的积分</List.Item>
              <List.Item arrow="horizontal" onClick={() => this.redirectTo('/ranking_group')}>积分排名</List.Item>
            </List>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank size="lg">
            <Button type="primary" onClick={e => this.toExit(e)}>退出</Button>
          </WingBlank>
        </Flex.Item>
      </Flex>
    );
  }
}

export default My;
