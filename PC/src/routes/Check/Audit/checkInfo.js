import React from 'react';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import 'ant-design-pro/dist/ant-design-pro.css';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './index.less';
import UserCircle from '../../../components/OAForm/SearchTable/UserCircle';
// import { getBuckleStatus } from '../../../utils/utils';

const { Description } = DescriptionList;

function EventInfo({ data }) {
  const list = data.participants || [];
  return (
    <div className={styles.eventInfo}>
      <DescriptionList
        size="large"
        col={1}
      >
        <Description term="编号">
          {data.event_id}
        </Description>
        <Description term="标题">
          {data.event_name}
        </Description>
        <Description term="事件内容">
          {data.description}
        </Description>
        <Description term="事件配置">
          {list.map((item, index) => {
            const key = index;
            return (
              <p key={key}>
                <Ellipsis length={3} className={styles.userName}>
                  {item.staff_name}
                </Ellipsis>
                <span className={styles.userPoint}>A：{`${item.point_a * item.count} (${item.point_a}x${item.count})`}</span>
                <span className={styles.userPoint}>B：{`${item.point_b * item.count} (${item.point_b}x${item.count})`}</span>
              </p>
            );
          })}
        </Description>
      </DescriptionList>
    </div>
  );
}

function Approver({ tip, data }) {
  const title = (
    <div className={styles.title}>
      <span className={styles.left}>{tip}</span>
      <span className={styles.right}>{data.time}</span>
    </div>
  );
  const statusId = data.status_id;
  // const status = getBuckleStatus(statusId);

  return (
    <div className={styles.approver}>
      <DescriptionList size="large" col={1} layout="vertical">
        <Description>
          {title}
          <div style={{ display: 'flex', marginLeft: 10 }} >
            <UserCircle>
              {data.staff_name}
            </UserCircle>
            {(data.time || data.rejected) && (
              <div className={styles.dec}>
                <div
                  className={styles.describe}
                >
                  <div className={styles.arrow}>
                    <span />
                  </div>
                  <p className={(statusId > 0 ? styles.pass : styles.reject)}>
                    {data.time && '通过'}
                    {data.rejected && '驳回'}
                  </p>
                  {
                    statusId > 0 && data.time && (
                      <p className={styles.description}>
                        {data.remark}
                      </p>
                    )
                  }
                </div>
                {
                  data.point && data.point.recorder_name && (
                    <p style={{ color: '#969696', marginTop: 10 }}>
                      记录人：{data.point.recorder_name} {data.point.recorder > 0 ? `+${data.point.recorder}` : data.point.recorder}
                    </p>
                  )
                }
                {
                  data.point && data.point.first_approver_name && (
                    <p style={{ color: '#969696', marginTop: 10 }}>
                      初审人：{data.point.first_approver_name} {data.point.first_approver > 0 ? `+${data.point.first_approver}` : data.point.first_approver}
                    </p>
                  )
                }
              </div>
            )}
          </div>
        </Description>
      </DescriptionList>
    </div>
  );
}

function StaffCustormer({ title, data }) {
  return (
    <div className={styles.approver}>
      <DescriptionList size="large" col={1} layout="vertical">
        <Description term={title}>
          <div style={{ marginLeft: 10 }}>
            {data.map((item, i) => {
              const key = i;
              return (
                <UserCircle key={key}>
                  {item}
                </UserCircle>
              );
            })}
          </div>
        </Description>
      </DescriptionList>
    </div>
  );
}

function getApproverData(data) {
  const first = {
    staff_sn: data.first_approver_sn || null,
    staff_name: data.first_approver_name || null,
    status_id: data.status_id,
    remark: data.first_approve_remark || null,
    time: data.first_approved_at || null,
    rejected: data.rejected_at || null,
  };
  const last = {
    staff_sn: data.final_approver_sn || null,
    staff_name: data.final_approver_name || null,
    remark: data.final_approve_remark || null,
    status_id: data.status_id,
    time: data.final_approved_at || null,
    rejected: data.rejected_at || null,
    point: {
      recorder_name: data.recorder_name || null,
      recorder: data.recorder_point || null,
      first_approver_name: data.first_approver || null,
      first_approver: data.first_approver_point || null,
    },
  };
  return {
    first,
    last,
  };
}

export {
  EventInfo,
  Approver,
  StaffCustormer,
};
export default function CheckInfo({ data }) {
  const able = Object.keys(data).length;
  const { first, last } = getApproverData(data);
  const addrStaff = data.addressees || [];
  const addressees = addrStaff.map(item => item.staff_name);
  const recorder = data.recorder_name ? [data.recorder_name] : [];
  const logs = data.logs || [];
  let participantCount = 0;
  logs.forEach((item) => {
    participantCount += item.participants.length;
  });
  return (
    <React.Fragment>
      <div className={styles.contentInfo}>
        <DescriptionList size="large" title="基础信息" col={1} >
          <Description term="主题">
            {data.title}
          </Description>
          <Description term="事件时间">
            {data.executed_at}
          </Description>
          <Description term="备注">
            {data.remark}
          </Description>
        </DescriptionList>
      </div>
      <div className={styles.contentInfo}>
        <div className={styles.eventTitle}>
          <div>事件详情</div>
          <div className={styles.eventCount}>
            <span>事件数量：{logs.length}</span>
            <span>总人次：{participantCount}</span>
          </div>
        </div>
        {logs.map((item, index) => {
          const key = index;
          return (
            <EventInfo key={key} data={item} />
          );
        })}

      </div>
      <div className={styles.contentInfo}>
        <div className={styles.eventTitle}>
          <div>审核进度</div>
        </div>
        {able !== 0 && <Approver tip="初审人" data={first} />}
        {able !== 0 && <Approver tip="终审人" data={last} />}
        <StaffCustormer title="抄送人" data={addressees} />
        <StaffCustormer title="记录人" data={recorder} />
      </div>
    </React.Fragment>
  );
}
