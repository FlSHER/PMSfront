import React from 'react';
import { connect } from 'dva';
import OATable from '../../../components/OATable';

const status = [
  { value: 0, text: '待审核' },
  { value: 1, text: '初审通过' },
  { value: 2, text: '终审通过' },
  { value: -1, text: '驳回' },
  { value: -2, text: '撤回' },
  { value: -3, text: '撤销' },
];

@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetch'],
}))
export default class extends React.PureComponent {
  fetch = (params) => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'buckle/fetch',
      payload: {
        ...params,
        type,
      },
    });
  }

  makeColums = () => {
    const columns = [
      {
        title: '主题',
        dataIndex: 'title',
        searcher: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        searcher: true,
      },
      {
        title: '时间',
        dataIndex: 'executed_at',
        dateFilters: true,
      },
      {
        title: '事件状态',
        dataIndex: 'status_id',
        filters: status,
        render: (statusId) => {
          const statusText = status.find(item => item.value === statusId);
          return statusText.text || '';
        },
      },
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        searcher: true,
      },
      {
        title: '记录人',
        dataIndex: 'recorder_name',
        searcher: true,
      },
      {
        title: '操作',
        render: () => {
          return <a style={{ color: '#59c3c3' }}>查看</a>;
        },
      },
    ];
    return columns;
  }

  render() {
    const { buckle, loading, type } = this.props;
    const reuslt = buckle[type];
    return (
      <OATable
        serverSide
        loading={loading}
        columns={this.makeColums()}
        data={reuslt && reuslt.data}
        total={reuslt && reuslt.total}
        fetchDataSource={this.fetch}
      />
    );
  }
}
