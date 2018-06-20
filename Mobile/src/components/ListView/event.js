import React, { PureComponent } from 'react';
import { List } from 'antd-mobile';

export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    makeListItemProps = (item) => {
      const response = {
        ...this.props,
        value: item,
      };
      return response;
    }
    render() {
      const { dataSource } = this.props;
      return (
        <List>
          {dataSource.map((item, i) => {
              const idx = i;
              return (
                <ListItem
                  key={idx}
                  {...this.makeListItemProps(item)}
                />
              );
            })}
        </List>
      );
    }
  }
  NewItem.defaultProps = {
    onChange: () => { },
  };
  return NewItem;
}

