import React from 'react';
import { Divider, Input } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import OATable from '../../../components/OATable';
import OAForm, { OAModal, create } from '../../../components/OAForm';
import BuckleInfo from './info';
import { makerFilters, getBuckleStatus, statusData } from '../../../utils/utils';
import styles from './index.less';

const status = [
  { value: 2, text: '已通过' },
  { value: -1, text: '已驳回' },
];

const step = [
  { value: 'first', text: '初审' },
  { value: 'final', text: '终审' },
];

const cate = [
  { value: 'audit', text: '通过' },
  { value: 'reject', text: '驳回' },
];

const FormItem = OAForm.Item;

@create()
@connect(({ buckle, loading }) => ({
  buckle,
  fetching: loading.effects['buckle/fetchBuckleGroups'],
  loading: loading.effects['buckle/withdrawBuckle'],
}))
export default class extends React.PureComponent {
  state = {
    editInfo: {},
    visible: false,
    id: null,
  };

  fetch = (_, params) => {
    const { dispatch, type } = this.props;
    let newParams = { ...params };
    const extarParams = {};
    if (newParams.filters.step) {
      extarParams.step = newParams.filters.step;
      delete newParams.filters.step;
    }
    if (newParams.filters.cate) {
      extarParams.cate = newParams.filters.cate;
      delete newParams.filters.cate;
    }
    if (params.filters.status_id) {
      if (typeof params.filters.status_id === 'string') {
        const temp = params.filters.status_id.split(',');
        newParams.filters.status_id = {};
        newParams.filters.status_id.in = temp;
      } else {
        const whereStatus = params.filters.status_id.in;
        let statusId = [];
        whereStatus.forEach((item) => {
          const temp = item.split(',');
          statusId = [...statusId, ...temp];
        });
        newParams.filters.status_id.in = statusId;
      }
    }
    newParams = makerFilters(newParams);
    this[type] = newParams;
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
        tooltip: true,
        searcher: true,
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'remark',
        tooltip: true,
        searcher: true,
      },
      {
        title: '事件时间',
        dataIndex: 'executed_at',
        width: 135,
        sorter: true,
        dateFilters: true,
        render: (time) => {
          return moment(time).format('YYYY-MM-DD');
        },
      },
    ];
    const userInfo = window.user || {};
    const currentSn = userInfo.staff_sn || '';
    const cateColumn = [
      {
        title: '操作类型',
        dataIndex: 'cate',
        filters: cate,
        width: 100,
        filterMultiple: false,
        align: 'center',
        onFilter: () => {
          return true;
        },
        render: (_, record) => {
          if (
            (currentSn === record.rejecter_sn) && (record.status_id === -1)
          ) {
            return '驳回';
          }

          if (
            (record.final_approved_at) || (record.first_approved_at)
          ) {
            return '通过';
          }
          return '';
        },
      },
    ];

    const stepColumn = [
      {
        title: '环节',
        dataIndex: 'step',
        filters: step,
        width: 100,
        filterMultiple: false,
        align: 'center',
        render: (_, record) => {
          if (currentSn === record.final_approver_sn) {
            return '终审';
          } else if (currentSn === record.first_approver_sn) {
            return '初审';
          }
        },
      },
    ];

    const statusColumn = [
      {
        title: '事件状态',
        dataIndex: 'status_id',
        width: 110,
        filters: statusData,
        align: 'center',
        render: (statusId) => {
          if (type !== 'approved') return getBuckleStatus(statusId) || '审核中';
          const { text } = status.find(item => item.value === statusId) || { text: '' };
          return text;
        },
      },
    ];

    const columns2 = [
      {
        title: '事件数量',
        align: 'center',
        dataIndex: 'event_count',
        sorter: true,
        width: 130,
        rangeFilters: true,
      },
      {
        title: '总人次',
        align: 'center',
        width: 130,
        dataIndex: 'participant_count',
        sorter: true,
        rangeFilters: true,
      },
    ];

    const firstFinal = [
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        width: 110,
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        width: 110,
        searcher: true,
      },
    ];

    const recorderColumn = [
      {
        title: '记录人',
        dataIndex: 'recorder_name',
        width: 110,
        searcher: true,
      },
    ];

    const commonColum = [
      {
        title: '记录时间',
        dataIndex: 'created_at',
        dateFilters: true,
        sorter: true,
        defaultSortOrder: 'descend',
        width: 150,
        render: (time) => {
          return moment(time).format('YYYY-MM-DD HH:mm');
        },
      },
      {
        title: '操作',
        ...(type !== 'addressee' ? { width: 180 } : { width: 60 }),
        fixed: 'right',
        render: (_, record) => {
          return this.makeAction(record);
        },
      },
    ];

    if (['addressee'].indexOf(type) !== -1) {
      return columns.concat(columns2, firstFinal, recorderColumn, commonColum);
    }
    if (['recorded'].indexOf(type) !== -1) {
      return columns.concat(statusColumn, columns2, commonColum);
    }
    if (['approved'].indexOf(type) !== -1) {
      return columns.concat(stepColumn, cateColumn, columns2, recorderColumn, commonColum);
    }
    if (['processing'].indexOf(type) !== -1) {
      return columns.concat(stepColumn, columns2, recorderColumn, commonColum);
    }
  }

  // fetchCancel = (id) => {
  //   const { dispatch, type, onError } = this.props;
  //   dispatch({
  //     type: 'buckle/withdrawBuckle',
  //     payload: { id, type },
  //     onError,
  //     onSuccess: this.setState({ visible: false }),
  //   });
  // }

  showCancelConfirm = (id) => {
    this.setState({ visible: true, id });
  }

  showInfo = (record) => {
    this.setState({ editInfo: { ...record } }, () => {
      const { onClose, type } = this.props;
      onClose(true, type);
    });
  }

  handleSubmit = (params) => {
    const { dispatch, type, onError } = this.props;
    const { id } = this.state;
    dispatch({
      type: 'buckle/withdrawBuckle',
      payload: {
        id,
        type,
        ...params,
      },
      onError,
      onSuccess: this.setState({ visible: false, id: null }),
    });
  }

  makeAction = (record) => {
    const { type, dispatch } = this.props;
    const action = [(
      <a
        key="info"
        className={styles.defaultAlink}
        onClick={() => this.showInfo(record)}
      >
        查看
      </a>
    )];
    if (type === 'recorded') {
      const linkCancelProps = {
        className: styles.defaultAlink,
        onClick: () => this.showCancelConfirm(record.id),
      };
      if ([0, 1].indexOf(record.status_id) === -1) {
        linkCancelProps.className = styles.noAllowed;
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
        className: styles.defaultAlink,
        onClick: () => {
          dispatch(routerRedux.push(`/reward/buckle/submission/${record.id}`));
        },
      };
      // if ([-1, -2, -3].indexOf(record.status_id) === -1) {
      //   linkResubmitProps.className = styles.noAllowed;
      //   linkResubmitProps.onClick = () => { };
      // }
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
    const { form, buckle, fetching, type, visible, onClose, onSubmit } = this.props;
    const { getFieldDecorator } = form;
    const { editInfo } = this.state;
    const reuslt = buckle[type];
    const x = ['addressee', 'approved'].indexOf(type) !== -1 ? 1300 : 1200;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <React.Fragment>
        <OAModal
          width={550}
          visible={this.state.visible}
          title="撤回"
          onSubmit={onSubmit(this.handleSubmit)}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <FormItem label="理由" {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: '',
            })(
              <Input.TextArea style={{ height: 90 }} placeholder="请输入理由" />
            )}
          </FormItem>
        </OAModal>
        <OATable
          serverSide
          autoScroll
          id={type}
          loading={fetching}
          scroll={{ x }}
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
          fetchCancel={this.showCancelConfirm}
          onClose={(_, update) => {
            this.setState({ editInfo: {} }, () => {
              if (update) this.fetch({}, this[type]);
              onClose(false, type);
            });
          }}
        />
      </React.Fragment>
    );
  }
}
