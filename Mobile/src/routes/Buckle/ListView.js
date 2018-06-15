import React, { PureComponent } from 'react';
import { PullToRefresh, Modal, Flex, WingBlank } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import style from './index.less';

export default function ListView(ListItem) {
  class NewItem extends PureComponent {
    state={
      shortModal: false,
      refreshing: false,
    }
    onClose = () => {
      this.setState({
        shortModal: false,
      });
    }
    onRefresh = () => {
      setTimeout(() => {
        this.setState({
          refreshing: false,
        });
      }, 1000);
    }
    showModal = (e) => {
      e.preventDefault(); // 修复 Android 上点击穿透
      this.setState({
        shortModal: true,
      });
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
          <Modal
            popup
            visible={this.state.shortModal}
            onClose={() => this.onClose('shortModal')}
            animationType="slide-up"
          >
            <div style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
              <WingBlank>
                <Flex
                  direction="column"
                >
                  <Flex.Item className={style.base_opt}>
                    <div className={[style.opt_item, style.agree].join(' ')}>驳回</div>
                    <div className={[style.opt_item, style.reject].join(' ')}>通过</div>
                  </Flex.Item>
                  <Flex.Item className={[style.opt_item, style.cancel].join(' ')}>取消</Flex.Item>
                </Flex>
              </WingBlank>
            </div>
          </Modal>
        </PullToRefresh>
      );
    }
  }
  NewItem.defaultProps = {
    onChange: () => { },
  };
  return NewItem;
}

