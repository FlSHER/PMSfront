import React from 'react';
import { Modal } from 'antd';

export default class OAModal extends React.PureComponent {
  render() {
    const { title, titleStyle } = this.props;
    return (
      <Modal
        {...this.props}
        title={(<div style={titleStyle || { width: '100%', height: '100%', textAlign: 'center' }}>{title}</div>)}
      />
    );
  }
}
OAModal.defaultProps = {
  title: '',
  titleStyle: null,
};
