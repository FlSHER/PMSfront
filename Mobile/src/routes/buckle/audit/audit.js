import React from 'react';
import {
  connect,
} from 'dva';
import { WingBlank, WhiteSpace, Flex } from 'antd-mobile';
// import defaultAvatar from '../../../assets/default_avatar.png';
// import style from '../index.less';
// import styles from '../../common.less';
import { Buckle } from '../../../common/ListView/index';
import { ListFilter, CheckBoxs } from '../../../components/index';
import style from '../index.less';
// import shortcut from '../../../assets/shortcuts.png';

@connect()
export default class BuckleAudit extends React.Component {
  state={
    shortModal: false,
    approType: '1',
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  onRefresh = () => {
    setTimeout(() => {
      this.setState({

      });
    }, 1000);
  }
  onCancel = (e, feild) => {
    this.setState({
      [feild]: !this.state[feild],
    });
  }
  showModal = (e, key) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  selFilter = (feild) => { // 筛选
    this.setState({
      [feild]: !this.state[feild],
    });
  }
  checkItem = (i, v) => {
    this.setState({
      approType: v,
    });
  }
  render() {
    return (
      <Flex direction="column" style={{ height: '100%' }}>
        <Flex.Item className={style.header}>
          <div className={style.state_tab}>
            <WhiteSpace size="md" />
            <Flex
              justify="around"
            >
              <Flex.Item>
                <div className={[style.state, style.active].join(' ')}>已审核</div>
              </Flex.Item>
              <Flex.Item>
                <div className={[style.state].join(' ')}>待审核</div>
              </Flex.Item>
              <Flex.Item>
                <div className={[style.state].join(' ')}>待审核</div>
              </Flex.Item>
            </Flex>
            <WhiteSpace size="md" />
          </div>
          <div className={style.filter_con}>
            <Flex
              justify="between"
              style={{ padding: '0 1.68rem' }}
            >
              <Flex.Item>
                <div className={[style.dosort, style.active].join(' ')}>默认排序</div>
              </Flex.Item>
              <Flex.Item>
                <div
                  className={[style.filter].join(' ')}
                  onClick={() => this.selFilter('visible')}
                >筛选
                </div>
              </Flex.Item>
            </Flex>
            <div className={style.some_sort}>
              <div className={style.sort_item}>默认排序</div>
              <div className={style.sort_item}>时间升序</div>
              <div className={style.sort_item}>时间降序</div>
            </div>
          </div>
        </Flex.Item>
        <Flex.Item className={style.content}>
          <WingBlank>
            <Buckle dataSource={[1, 2, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]} />
          </WingBlank>
        </Flex.Item>
        <ListFilter
          onOk={this.onFilterOk}
          filterKey="visible"
          onCancel={this.onCancel}
          onResetForm={this.onResetForm}
          iconStyle={{ width: '0.533rem', height: '0.533rem' }}
          visible={this.state.visible}
          contentStyle={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 999,
              textAlign: 'left',
              backgroundColor: 'rgba(0,0,0,0.2)',
              paddingLeft: '2rem',
            }}
        >

          <div className={style.filter_item}>
            <div className={style.title}>流程</div>
            <CheckBoxs
              option={[{ name: 1, value: '1' }, { name: 'xxx', value: '2' }]}
              checkStatus={(i, v) => this.checkItem(i, v)}
              value={[this.state.approType]}
            />
          </div>

        </ListFilter>
      </Flex>
    );
  }
}

