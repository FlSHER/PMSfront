import React, { PureComponent } from 'react';
import { PullToRefresh } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    state={
      refreshing: false,
    }
    makeListItemProps = (item) => {
      const response = {
        ...this.props,
        value: item,
      };
      return response;
    }
    render() {
      const { dataSource, onRefresh } = this.props;
      return (
        <PullToRefresh
          ref={(el) => { this.ptr = el; }}
          style={{
          height: '100%',
          overflow: 'auto',
        }}
          refreshing={this.state.refreshing}
          onRefresh={
          onRefresh
        }
        >
          <QueueAnim>
            {dataSource.map((item, i) => {
              const idx = i;
              return (
                <ListItem
                  {...this.makeListItemProps(item)}
                  key={idx}
                />
              );
            })}
          </QueueAnim>
        </PullToRefresh>
      );
    }
  }
  NewItem.defaultProps = {
    onChange: () => { },
  };
  return NewItem;
}

