import React from 'react';
import ModalFilters from '../components/ModalFilters';

export default class Nothing extends React.Component {
  state = {
    visible: false,
  }
  render() {
    return (
      <div>
        <div onClick={() =>
          this.setState({
            visible: true,
          })}
        >
          测试
        </div>
        <ModalFilters
          visible={this.state.visible}
        />
      </div>


    );
  }
}
