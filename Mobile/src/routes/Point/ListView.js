import React, { PureComponent } from 'react';
import { PullToRefresh } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    state={
      refreshing: false,
    }

    onRefresh = () => {
      setTimeout(() => {
        this.setState({
          refreshing: false,
        });
      }, 1000);
    }

    makeListItemProps = (item) => {
      const response = {
        ...this.props,
        value: item,
      };
      response.onShortcut = this.showModal;
      return response;
    }
    render() {
      const { dataSource } = this.props;
      return (
        <PullToRefresh
          ref={(el) => { this.ptr = el; }}
          style={{
          height: '100%',
          overflow: 'auto',
        }}
          refreshing={this.state.refreshing}
          onRefresh={
          this.onRefresh
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

