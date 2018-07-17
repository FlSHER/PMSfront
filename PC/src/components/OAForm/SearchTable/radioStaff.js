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
    let tagsData = {};
    const plusAble = value && Object.keys(value).length;
    if (plusAble) {
      tagsData = {
        value: value[valueName],
        label: value[showName] || '',
      };
    }
    const click = this.props.disabled ? null : {
      onClick: () => {
        this.props.handleModelVisble(true);
      },
    };
    const color = this.props.disabled ? '#f5f5f5' : '#fff';
    const mouseStyle = this.props.disabled ? 'not-allowed' : 'pointer';

    const tag = tagsData.label;
    const isLongTag = tag.length > 20;
    const key = `tag-value-${tagsData.value}`;
    const tagElem = (
      <CircleTag
        key={tagsData.value}
        style={{ cursor: mouseStyle, background: color }}
        closable={!this.props.disabled}
        afterClose={() => this.handleTagRemove(tagsData.key)}
      >
        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
      </CircleTag>
    );
    const tags = isLongTag ? <Tooltip title={tag} key={key}>{tagElem}</Tooltip> : tagElem;

    return (
      <div>
        {plusAble ? tags : (
          <CircleTag
            key="tag.add"
            {...click}
            style={{ cursor: mouseStyle, background: color, borderStyle: 'dashed' }}
          >
            <Button Icon="plus" shape="circle" />
          </CircleTag>
        )}
      </div>
    );
  }
}
