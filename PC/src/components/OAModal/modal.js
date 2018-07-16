import React from 'react';
import { Modal } from 'antd';

export default class OAModal extends React.PureComponent {
  render() {
    const { title, titleStyle } = this.props;
    return (
      <Modal
        destroyOnClose
        {...this.props}
        title={(
          <div style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '40px',
            color: '#fff',
            ...titleStyle,
          }}
          >
            {title}
          </div>
        )}
      />
    );
  }
}
OAModal.defaultProps = {
  title: '',
  titleStyle: {},
};
