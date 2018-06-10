import React, { PureComponent } from 'react';
import {
  SearchBar,
  Flex,
  WhiteSpace,
  WingBlank,
  List,
} from 'antd-mobile';
import { connect } from 'dva';
import './test.less';

@connect(({ searchStaff }) => ({
  department: searchStaff.department,
}))
export default class SearchBarExample extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchsearchStaff',
      payload: {
        parent_id: 0,
      },
    });
  }

  render() {
    const { department } = this.props;
    return (
      <div>
        <Flex>
          <Flex.Item className="search">
            <SearchBar placeholder="Search" maxLength={8} />
          </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <Flex style={{ fontSize: '0.42666667rem' }}>
            联系人
          </Flex>
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg" style={{ fontSize: '16px' }}>
          <div className="checkedAll">
            <Flex>
              <Flex.Item className="checkIcon">
                全选
              </Flex.Item>
            </Flex>
          </div>
          <Flex>
            <List >
              {department.map(item => item.name)}
            </List>
          </Flex>
        </WingBlank>
      </div>
    );
  }
}
