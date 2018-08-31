import React from 'react';
import {
  connect,
} from 'dva';
import { List, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import style from '../index.less';
import styles from '../../common.less';
import { PersonIcon } from '../../../components/index.js';
import { analyzePath } from '../../../utils/util';

@connect(({ point }) => ({
  pointDetails: point.pointDetails,
}))
export default class PointDetail extends React.Component {
  state = {
    pointLog: '',
  }

  componentWillMount() {
    const { dispatch, location } = this.props;
    const pointLog = analyzePath(location.pathname, 1);
    this.setState({
      pointLog,
    }, () => {
      dispatch({
        type: 'point/getPointDetail',
        payload: { id: pointLog },
      });
    });
  }

  toLookDetail = () => {
    const { history, pointDetails } = this.props;
    const { pointLog } = this.state;
    const detail = pointDetails[pointLog];
    const sourceId = detail.source_id;
    const sourceForeignKey = detail.source_foreign_key;
    let path = '/audit_detail';
    if (`${sourceId}` === '0') {
      path = '/base_detail';
    }
    const url = `${path}/${sourceForeignKey}`;
    history.push(url);
  }
  render() {
    const { pointDetails } = this.props;
    const { pointLog } = this.state;
    const detail = pointDetails[pointLog];
    if (!detail) {
      return null;
    }
    const sourceId = detail.source_id;
    const hasDetail = `${sourceId}` === '2' || `${sourceId}` === '0';
    return (
      <div
        className={styles.con}
        direction="column"
      >
        <div className={styles.con_content}>
          <WhiteSpace size="md" />

          <WingBlank className={style.parcel}>
            <List>
              <div style={{ padding: '0.4rem 15px' }}>
                <div className={style.event_title}>
                  {detail.title}
                </div>
              </div>
            </List>
            <div className={style.event_info}>
              <span>姓名</span>
              <span>{detail.staff_name}（{detail.staff_sn}）</span>
            </div>
            <div className={style.event_info}>
              <span>品牌</span>
              <span>{detail.brand_name}</span>
            </div>
            <div className={style.event_info}>
              <span>部门</span>
              <span>{detail.department_name}</span>
            </div>
            <div className={style.event_info}>
              <span>店铺</span>
              <span>{detail.shop_name}</span>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank>
            <div className={style.players}>
              <Flex className={style.title} id="participants">
                <Flex.Item >积分变化</Flex.Item>
                {hasDetail && (
                <Flex.Item
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: 'rgb(24, 116, 208)',
                  }}
                  onClick={this.toLookDetail}
                >
                查看详情
                </Flex.Item>
                )}
              </Flex>
              <Flex style={{ padding: '0.53rem 0 1.06667rem 0' }}>
                <Flex.Item>
                  <div>
                    <div className={style.point_a}>A分</div>
                    <div
                      className={[style.point_a_value, detail.point_a > 0 ? style.success : style.error].join(' ')}
                    >
                      {detail.point_a}
                    </div>
                  </div>
                </Flex.Item>
                <Flex.Item>
                  <div >
                    <div
                      className={style.point_b}
                    >
                      B分
                    </div>
                    <div
                      className={[style.point_b_value, detail.point_b > 0 ? style.success : style.error].join(' ')}
                    >
                      {detail.point_b}
                    </div>
                  </div>
                </Flex.Item>
              </Flex>
              <div >
                <div className={style.point_info}>积分来源：{detail.source.name}</div>
                <div className={style.point_info}>变化时间：{detail.changed_at}</div>
                <div className={style.point_info}>记录时间：{detail.created_at}</div>
              </div>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 初审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  value={detail}
                  nameKey="first_approver_name"
                />

              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
          <WingBlank className={style.parcel}>
            <div className={style.players}>
              <Flex className={style.title}> 终审人</Flex>
              <Flex
                className={style.person_list}
                wrap="wrap"
              >
                <PersonIcon
                  value={detail}
                  nameKey="final_approver_name"
                />
              </Flex>
            </div>
          </WingBlank>
          <WhiteSpace size="md" />
        </div>
      </div>
    );
  }
}

