import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import OATable from '../../../components/OATable';
import BuckleInfo from './info';

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
  loading: loading.effects['buckle/fetchBuckleGroups'],
}))
export default class extends React.PureComponent {
  state = { visible: false, editInfo: null };


  handleDrawerVisible = (flag) => {
    this.setState({
      visible: !!flag,
    });
  };

  fetch = (params) => {
    const { dispatch, type } = this.props;
    dispatch({
      type: 'buckle/fetchBuckleGroups',
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
        width: 150,
        dataIndex: 'remark',
        searcher: true,
      },
      {
        title: '事件时间',
        dataIndex: 'executed_at',
        dateFilters: true,
        render: (time) => {
          return moment(time).format('YYYY-MM-DD HH:MM');
        },
      },
      {
        title: '事件状态',
        width: 50,
        dataIndex: 'status_id',
        filters: status,
        render: (statusId) => {
          const statusText = status.find(item => item.value === statusId);
          return statusText.text || '';
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
                this.setState({ editInfo: record.id }, () => {
                  this.handleDrawerVisible(true);
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
    const { buckle, loading, type } = this.props;
    const { visible, editInfo } = this.state;
    const reuslt = buckle[type];
    return (
      <React.Fragment>
        <OATable
          serverSide
          loading={loading}
          scroll={{ x: 1000 }}
          columns={this.makeColums()}
          data={reuslt && reuslt.data}
          total={reuslt && reuslt.total}
          fetchDataSource={this.fetch}
        />
        <BuckleInfo
          visible={visible}
          id={editInfo}
          onClose={() => this.handleDrawerVisible()}
        />
      </React.Fragment>
    );
  }
}
