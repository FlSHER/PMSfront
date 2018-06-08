import React, { PureComponent } from 'react';
import { List } from 'antd-mobile';

export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    state = {
      muti: [],
    }
    componentWillReceiveProps(nextProps) {
      const { selected } = nextProps;
      if (selected && JSON.stringify(selected) !== JSON.stringify(this.state.muti)) {
        this.setState({
          muti: [...nextProps.selected],
        });
      }
    }

    handlesMultiple = (item) => { // 多选
      const { muti } = this.state;
      const { onChange, name } = this.props;

      let newMuti = [...muti];

      const id = item[name];
      const dataId = muti.map(m => m[name]);
      const idIndex = dataId.indexOf(id);
      if (idIndex !== -1) {
        newMuti = muti.filter((its, index) => index !== idIndex);
      } else {
        newMuti.push(item);
      }

      this.setState({
        muti: [...newMuti],
      }, () => {
        onChange(this.state.muti);
      });
    }

    makeListItemProps = (item) => {
      const { muti } = this.state;
      const { multiple, onChange, name } = this.props;
      const response = {
        ...this.props,
        value: item,
      };
      if (!this.props.fetchDataSource) {
        response.onClick = multiple ? this.handlesMultiple : onChange;
        const dataId = muti.map(m => m[name]);
        response.checked = dataId.includes(item[name]);
      }
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

