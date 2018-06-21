import React, { PureComponent } from 'react';
import { PullToRefresh, Modal, Flex, WingBlank } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import style from './index.less';

let startX;
let startY;
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
    // 返回角度
    GetSlideAngle = (dx, dy) => {
      // Math.atan2返回弧度值
      return (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection = (sX, sY, endX, endY) => {
      const dy = sY - endY;
      const dx = endX - sX;
      let result = 0;
      // 如果滑动距离太短
      // if (Math.abs(dx) < 2 && Math.abs(dy) < 16) {
      //   return result;
      // }
      // 距离小于16，
      if (((dx * dx) + (dy * dy)) < 256) {
        return result;
      }
      // 判断方向
      const angle = this.GetSlideAngle(dx, dy);
      if (angle >= -45 && angle < 45) {
        result = 4;
      } else if (angle >= 45 && angle < 135) {
        result = 1;
      } else if (angle >= -135 && angle < -45) {
        result = 2;
      } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
      }

      return result;
    }
    doLoadMore = (str) => {
      const { page, totalpage, onPageChange } = this.props;
      // console.log(page, totalpage);
      if (page === totalpage) {
        return false;
      }
      if (str === 'up') {
        onPageChange();
      }
    }
    handleStart = (ev) => {
      startX = ev.touches[0].pageX;
      startY = ev.touches[0].pageY;
    }

    handleEnd = (ev) => {
      const self = this;
      const endX = ev.changedTouches[0].pageX;
      const endY = ev.changedTouches[0].pageY;
      const direction = this.GetSlideDirection(startX, startY, endX, endY);
      switch (direction) {
        case 0:
          self.doLoadMore('no');
          break;
        case 1:
          self.doLoadMore('up');
          break;
        case 2:
          self.doLoadMore('down');
          break;
        case 3:
          self.doLoadMore('left');
          break;
        case 4:
          self.doLoadMore('right');
          break;
        default:
      }
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
            <div
              onTouchStart={this.handleStart}
              onTouchEnd={this.handleEnd}
            >
              {(dataSource || []).map((item, i) => {
              const idx = i;
              return (
                <ListItem
                  {...this.makeListItemProps(item)}
                  key={idx}
                />
              );
            })}
            </div>
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

