import React from 'react';
import { Button } from 'antd-mobile';
import ModalFilters from '../components/ModalFilters';

export default class Nothing extends React.Component {
  state = {
    visible: false,
    model: 'filter',
  }

  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  render() {
    return (
      <div>
        <Button style={{ margin: 20 }} type="primary" size="small" inline onClick={() => this.handleVisible(true, 'filter')}>
          筛选
        </Button>
        <Button style={{ margin: 20 }} type="primary" size="small" inline onClick={() => this.handleVisible(true, 'sort')}>
          排序
        </Button>
        <ModalFilters
          visible={this.state.visible}
          model={this.state.model}
          onCancel={this.handleVisible}
        />
      </div>
    );
  }
}
