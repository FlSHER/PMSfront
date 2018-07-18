import React from 'react';
import {
  Tooltip,
  Icon,
} from 'antd';
import UserCircle from './UserCircle';
import styles from './index.less';

export default class extends React.PureComponent {
  render() {
    const { value, showName, valueName, clearValue, style, handleModelVisble } = this.props;
    let tagsData = {};
    let tags = null;
    const plusAble = value && Object.keys(value).length;
    const color = this.props.disabled ? '#f5f5f5' : '#fff';
    const mouseStyle = this.props.disabled ? 'not-allowed' : 'pointer';
    if (plusAble) {
      tagsData = value[showName] || '';
      const tag = tagsData;
      const isLongTag = tag.length > 20;
      const key = `tag-value-${value[valueName]}`;
      const tagElem = (
        <UserCircle
          key={tagsData.value}
          style={{ background: color }}
          closable={!this.props.disabled}
          afterClose={() => clearValue()}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </UserCircle>
      );
      tags = isLongTag ? <Tooltip title={tag} key={key}>{tagElem}</Tooltip> : tagElem;
    }
    const click = this.props.disabled ? null : {
      onClick: () => handleModelVisble(true),
    };
    return (
      <React.Fragment>
        {plusAble ? tags : (
          <div
            className={styles.dashed}
            style={{
              cursor: mouseStyle,
              background: color,
              ...style,
            }}
            {...click}
          >
            <Icon type="plus" />
          </div>
        )}
      </React.Fragment>
    );
  }
}
