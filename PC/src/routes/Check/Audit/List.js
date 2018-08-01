import React from 'react';
import { Divider, Modal } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OATable from '../../../components/OATable';
import BuckleInfo from './info';
import { makerFilters, getBuckleStatus, statusData } from '../../../utils/utils';

const status = [
  { value: 0, text: '待初审' },
  { value: 1, text: '待终审' },
];

const step = [
  { value: 'first', text: '初审' },
  { value: 'final', text: '终审' },
];

const cate = [
  { value: 'audit', text: '通过' },
  { value: 'reject', text: '驳回' },
];

const { confirm } = Modal;

@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetchBuckleGroups'],
  cancelLoading: loading.effects['buckle/withdrawBuckle'],
}))
export default class extends React.PureComponent {
  state = { editInfo: {} };

  fetch = (_, params) => {
    const { dispatch, type } = this.props;
    let newParams = { ...params };
    const extarParams = {};
    if (type === 'approved') {
      if (newParams.filters.step) {
        extarParams.step = newParams.filters.step;
        delete newParams.filters.step;
      }
      if (newParams.filters.cate) {
        extarParams.cate = newParams.filters.cate;
        delete newParams.filters.cate;
      }
    }
    newParams = makerFilters(newParams);
    dispatch({
      type: 'buckle/fetchBuckleGroups',
      payload: {
        type,
        ...newParams,
        ...extarParams,
      },
    });
  }

  makeColums = () => {
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
          return moment(time).format('YYYY-MM-DD');
        },
      },
    ];
    const userInfo = window.user || {};
    const currentSn = userInfo.staff_sn || '';
    const approver = [
      {
        title: '审核类型',
        dataIndex: 'step',
        filters: step,
        filterMultiple: false,
        onFilter: () => {
          return true;
        },
        render: (_, record) => {
          if (currentSn === record.final_approver_sn) {
            return '终审';
          } else if (currentSn === record.first_approver_sn) {
            return '初审';
          }
        },
      },
      {
        title: '操作类型',
        dataIndex: 'cate',
        filters: cate,
        filterMultiple: false,
        onFilter: () => {
          return true;
        },
        render: (_, record) => {
          if (
            (currentSn === record.rejecter_sn) && (record.status_id === -1)
          ) {
            return '已驳回';
          }

          if (
            (record.final_approved_at) || (record.first_approved_at)
          ) {
            return '已通过';
          }
          return '';
        },
      },
    ];

    const processing = [
      {
        title: '审核类型',
        dataIndex: 'status_id',
        filters: type !== 'approved' ? statusData : status,
        onFilter: () => {
          return true;
        },
        render: (statusId) => {
          if (type !== 'approved') return getBuckleStatus(statusId);
          const { text } = status.find(item => item.value === statusId) || { text: '' };
          return text;
        },
      },
    ];

    const columns2 = [
      {
        title: '数量',
        align: 'center',
        dataIndex: 'event_count',
        sorter: true,
        rangeFilters: true,
      },
      {
        title: '总人次',
        align: 'center',
        dataIndex: 'participant_count',
        sorter: true,
        rangeFilters: true,
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
          return moment(time).format('YYYY-MM-DD HH:mm');
        },
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        render: (_, record) => {
          return this.makeAction(record);
        },
      },
    ];
    if (['processing', 'addressee', 'recorded'].indexOf(type) !== -1) return columns.concat(processing, columns2);
    if (type === 'approved') return columns.concat(approver, columns2);
  }

  fetchCancel = (id) => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: { id, type },
    });
  }

  showCancelConfirm = (id) => {
    confirm({
      title: '确定要撤回该条记录吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.fetchCancel(id);
      },
    });
  }

  showInfo = (record) => {
    this.setState({ editInfo: { ...record } }, () => {
      const { onClose, type } = this.props;
      onClose(true, type);
    });
  }

  makeAction = (record) => {
    const { type, dispatch } = this.props;
    const action = [(
      <a
        key="info"
        style={{ color: '#59c3c3' }}
        onClick={() => this.showInfo(record)}
      >
        查看
      </a>
    )];
    if (type === 'recorded') {
      const color = '#c8c8c8';
      const linkCancelProps = {
        style: { color: '#59c3c3' },
        onClick: () => this.showCancelConfirm(record.id),
      };
      if ([0, 1].indexOf(record.status_id) === -1) {
        linkCancelProps.style.color = color;
        linkCancelProps.onClick = () => { };
      }
      action.push(<Divider key="v1" type="vertical" />);
      action.push((
        <a
          key="cancel"
          {...linkCancelProps}
        >
          撤回
        </a>
      ));
      const linkResubmitProps = {
        style: { color: '#59c3c3' },
        onClick: () => {
          dispatch(routerRedux.push(`/reward/buckle/submission/${record.id}`));
        },
      };
      if ([-1, -2].indexOf(record.status_id) === -1) {
        linkResubmitProps.style.color = color;
        linkResubmitProps.onClick = () => { };
      }
      action.push(<Divider key="v2" type="vertical" />);
      action.push((
        <a
          key="resubmit"
          {...linkResubmitProps}
        >
          再次提交
        </a>
      ));
    }
    return action;
  }

  render() {
    const { buckle, loading, type, visible, onClose, cancelLoading } = this.props;
    const { editInfo } = this.state;
    const reuslt = buckle[type];
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={loading || cancelLoading}
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
          fetchCancel={this.fetchCancel}
          onClose={() => {
            this.setState({ editInfo: {} }, () => {
              onClose(false, type);
            });
          }}
        />
      </React.Fragment>
    );
  }
}
