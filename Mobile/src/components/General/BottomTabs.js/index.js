import React from 'react';
import {
  connect,
} from 'dva';
import { Flex } from 'antd-mobile';
import style from './index.less';

class Tabs extends React.Component {
  render() {
    const {
      option,
      checkItem,
      justify,
      handleClick,
    } = this.props;
    return (
      <Flex
        style={{ overflow: 'auto' }}
        justify={justify || 'start'}
      >
        {option.map(its => (
          <Flex.Item
            key={its.value}
            onClick={() => handleClick(its)}
          >
            <div className={[style.state, checkItem.value === its.value ? style.active : null].join(' ')}>{its.name}</div>
          </Flex.Item>
        ))}

      </Flex>
    );
  }
}

export default connect()(Tabs);
