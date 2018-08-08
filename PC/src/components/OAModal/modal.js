import React from 'react';
import { Modal } from 'antd';
import styles from './modal.less';
import { getModalToAndHeight } from '../../utils/utils';

export default class OAModal extends React.PureComponent {
  render() {
    const { title, titleStyle, bodyStyle } = this.props;
    const titleView = (
      <div
        className={styles.titleContent}
        style={titleStyle}
      >
        {title}
      </div>
    );
    const { height, top } = getModalToAndHeight();
    const style = { height: height - 40 };
    return (
      <Modal
        destroyOnClose
        style={{ top }}
        {...this.props}
        bodyStyle={{
          ...bodyStyle,
          ...style,
          // height: getModalBodyHeight(),
          overflowY: 'auto',
        }}
        title={titleView}
      />
    );
  }
}
OAModal.defaultProps = {
  title: '',
  width: 800,
  titleStyle: {},
};
