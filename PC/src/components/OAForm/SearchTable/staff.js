import React from 'react';
import {
  Tooltip,
  Icon,
  Button,
} from 'antd';
import styles from './index.less';


function CircleTag(props) {
  const { afterClose, closable, style, onClick, children } = props;
  return (
    <div
      onClick={onClick}
      className={styles.circlContent}
      style={style}
    >
      {closable && <span onClick={() => afterClose}><Icon type="close" /></span>}
      <div>
        {children}
      </div>
    </div>
  );
}

export default class extends React.PureComponent {
  handleTagRemove = (removedTag) => {
    this.props.setTagSelectedValue(removedTag);
  };

  render() {
    const { value, showName, valueName } = this.props;
    let tagsData = [];
    if (value && value.length > 0) {
      tagsData = value.map((item, index) => {
        return {
          value: item[valueName],
          label: item[showName] || '',
          key: index,
        };
      });
    }
    const click = this.props.disabled ? null : {
      onClick: () => {
        this.props.handleModelVisble(true);
      },
    };
    const color = this.props.disabled ? '#f5f5f5' : '#fff';
    const mouseStyle = this.props.disabled ? 'not-allowed' : 'pointer';
    const tags = tagsData.map((item, index) => {
      const tag = item.label;
      const isLongTag = tag.length > 20;
      const key = `tag${item.value}-${index}`;
      // const TooltipKey = `${tag}-${item.value}`;
      const tagElem = (
        <CircleTag
          key={key}
          style={{ cursor: mouseStyle, background: color }}
          closable={!this.props.disabled}
          afterClose={() => this.handleTagRemove(item.key)}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </CircleTag>
      );
      return isLongTag ? <Tooltip title={tag} key={key}>{tagElem}</Tooltip> : tagElem;
    });

    return (
      <div>
        {tags}
        <CircleTag
          key="tag.add"
          {...click}
          style={{ cursor: mouseStyle, background: color, borderStyle: 'dashed' }}
        >
          <Button Icon="plus" shape="circle" />
        </CircleTag>
      </div>
    );
  }
}
