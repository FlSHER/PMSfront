import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import UserCount from '../my';
import styles from './count.less';

@connect(({ point }) => ({
  staffInfo: point.accumulativeStaff,
}))
export default class extends React.Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const staffSn = match.params.staff_sn;
    dispatch({
      type: 'point/fetchStaffCount',
      payload: { staff_sn: staffSn },
    });
  }
  render() {
    const { match, staffInfo } = this.props;
    const staffSn = match.params.staff_sn;
    let staff = {};
    if (staffInfo[staffSn]) {
      staff = staffInfo[staffSn];
    }
    let staffTotal = {};
    if (staff.total) {
      staffTotal = staff.total;
    }
    return (
      <React.Fragment>
        <div style={{ padding: '0 30px' }}>
          <Button
            icon="left"
            type="primary"
            onClick={() => {
              this.props.history.goBack(-1);
            }}
          >返回排名列表
          </Button>
          <div className={styles['header-user']}>
            <p className={styles.user}>{staffTotal.staff_name ? `${staffTotal.staff_name}的积分详情` : ''}</p>
            <p className={styles.userInfo}>
              <span>员工编号：{`${staffTotal.staff_sn || ''}`}</span>
              <span>所属部门：{`${staffTotal.department_name || ''}`}</span>
            </p>
          </div>
        </div>
        <UserCount staffSn={staffSn} />
      </React.Fragment>
    );
  }
}
