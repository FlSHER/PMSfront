import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import OATable from '../../../components/OATable';
import BuckleInfo from './info';

const status = [
  { value: 0, text: '待初审' },
  { value: 1, text: '待终审' },
];

@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetchBuckleGroups'],
}))
export default class extends React.PureComponent {
  state = { editInfo: {} };

  fetch = (params) => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'buckle/fetchBuckleGroups',
      payload: {
        type,
        ...params,
      },
    });
  }

  makeColums = () => {
    const user = window.user || {};
    const radio = [
      { value: `1;first_approver_sn=${user.staff_sn}`, text: '初审通过' },
      { value: `2;final_approver_sn=${user.staff_sn}`, text: '终审通过' },
      { value: `-1;first_approver_sn=${user.staff_sn}`, text: '初审驳回' },
      { value: `-1;final_approver_sn=${user.staff_sn}`, text: '终审驳回' },
    ];
    const { type } = this.props;
    const columns = [
      {
        title: '主题',
        dataIndex: 'title',
        searcher: true,
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'remark',
        searcher: true,
      },
      {
        title: '事件时间',
        dataIndex: 'executed_at',
        sorter: true,
        dateFilters: true,
        render: (time) => {
          return moment(time).format('YYYY-MM-DD HH:MM');
        },
      },
      {
        title: '事件状态',
        width: 50,
        dataIndex: 'status_id',
        filters: type === 'processing' ? status : radio,
        filterMultiple: type === 'processing',
        onFilter: () => {
          return true;
        },
        render: (statusId, record) => {
          let statusText = type === 'processing' ? status.filter(item => item.value === statusId)[0].text : null;
          if (statusId === 1 && record.first_approver_sn === user.staff_sn) {
            statusText = '初审通过';
          } else if (statusId === 2 && record.final_approver_sn === user.staff_sn) {
            statusText = '终审通过';
          }
          if (statusId === -1) {
            statusText = record.first_approver_sn === user.staff_sn && '终审驳回';
            statusText = record.final_approver_sn === user.staff_sn && '初审驳回';
          }
          return statusText;
        },
      },
      {
        title: '数量',
        align: 'center',
        dataIndex: 'event_count',
        sorter: true,
        searcher: true,
      },
      {
        title: '总人次',
        align: 'center',
        dataIndex: 'participant_count',
        sorter: true,
        searcher: true,
      },
      {
        title: '记录人',
        dataIndex: 'recorder_name',
        searcher: true,
      },
      {
        title: '记录时间',
        dataIndex: 'created_at',
        dateFilters: true,
        sorter: true,
        sortOrder: 'descend',
        render: (time) => {
          return moment(time).format('YYYY-MM-DD HH:MM');
        },
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: (_, record) => {
          return (
            <a
              style={{ color: '#59c3c3' }}
              onClick={() => {
                this.setState({ editInfo: record }, () => {
                  this.props.onClose(true);
                });
              }}
            >
              查看
            </a>
          );
        },
      },
    ];
    return columns;
  }

  render() {
    const { buckle, loading, type, visible, onClose } = this.props;
    const { editInfo } = this.state;
    const reuslt = buckle[type];
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={loading}
          scroll={{ x: 1000 }}
          columns={this.makeColums()}
          data={reuslt.data || []}
          total={reuslt.total || 0}
          fetchDataSource={this.fetch}
        />
        <BuckleInfo
          type={type}
          visible={visible}
          id={editInfo.id}
          editInfo={editInfo}
          onClose={() => onClose(false)}
        />
      </React.Fragment>
    );
  }
}
