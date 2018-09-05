import React from 'react';
import { connect } from 'dva';
import Drawer from '../../../components/OADrawer';
import styles from './index.less';

@connect(({ point, loading }) => ({
  info: point.basePointDetails,
  loading: loading.effects['point/fetchBasePoint'],
}))
export default class extends React.Component {
  componentWillMount() {
    this.fetch(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetch(nextProps.id);
    }
  }

  fetch = (id) => {
    const { dispatch, type } = this.props;
    if (id) {
      dispatch({
        type: 'point/fetchBasePoint',
        payload: { id, type },
      });
    }
  }

  render() {
    const { id, onClose, loading, info, visible } = this.props;
    const data = info[id] || {};
    const details = data.details || [];
    const pointDetails = {
      max_point: {},
      position: {},
      certificate: {},
    };
    details.forEach((detail) => {
      pointDetails[detail.type] = detail;
    });
    const basicsPoint = pointDetails.max_point;
    const basicsData = basicsPoint.data || {};
    const { certificate, position } = pointDetails;
    const certificateData = certificate.data || [];
    const positionData = position.data || {};
    return (
      <React.Fragment>
        <Drawer
          title="基础分详情"
          visible={visible}
          onClose={() => { onClose(false); }}
          loading={loading}
        >
          <p className={styles.title}>{data.staff_name && `${data.staff_name}的积分明细`}</p>
          <p className={styles.staffInfo}>
            <span className={styles.staffSn}>员工编号：{data.staff_sn}</span>
            <span className={styles.dpt}>所属部门：{data.department_name}</span>
          </p>

          <p className={styles.point}>
            <span>基础分</span>
            <span style={{ fontSize: '24px', lineHeight: '22px', float: 'right' }}>{data.point_b}</span>
          </p>
          {
            pointDetails.max_point.point !== 0 && (
              <div className={styles.compose}>
                <div className={styles.title}>
                  <span>工龄分</span>
                  <span className={styles.point}>+{pointDetails.max_point.point}</span>
                </div>
                <div className={styles.content}>
                  <p>工龄：{basicsData['工龄'] || 0} 年</p>
                  <p className={styles.time}>入职时间：{basicsData['入职时间'] || ''}</p>
                </div>
              </div>
            )
          }
          {position.point !== 0 && (
            <div className={styles.compose}>
              <div className={styles.title}>
                <span>职位分</span>
                <span className={styles.point}>+{position.point}</span>
              </div>
              <div className={styles.content}>
                <p>职位：{positionData['职位'] || ''} </p>
              </div>
            </div>
          )}
          {(certificateData.length !== 0) && (
            <div className={styles.compose}>
              <div className={styles.title}>
                <span>证书分</span>
                <span className={styles.point}>+{certificate.point}</span>
              </div>
              <div className={styles.content}>
                {certificateData.map((item, index) => {
                  const key = index;
                  return (
                    <React.Fragment {...{ key }}>
                      <p className={styles.proved}>
                        <span>{item.name} </span>
                        <span className={styles.time}>+ {item.point || 0}</span>
                      </p>
                      <p className={styles.time}>{item.point.description}</p>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </Drawer>
      </React.Fragment>
    );
  }
}
