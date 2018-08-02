import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Ellipsis from '../../../components/Ellipsis';

import OATable from '../../../components/OATable';
import EventInfo from './info';
import { statusData } from '../../../utils/utils';


@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetch'],
}))
export default class extends React.PureComponent {
  state = {
    editInfo: {},
  }

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
        title: '事件标题',
        dataIndex: 'event_name',
        tooltip: true,
        searcher: true,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        tooltip: true,
        searcher: true,
      },
      {
        title: '事件时间',
        dataIndex: 'executed_at',
        sorter: true,
        sortOrder: 'descend',
        dateFilters: true,
        width: 132,
        render: (time) => {
          return moment(time).format('YYYY-MM-DD');
        },
      },
      {
        title: '事件状态',
        dataIndex: 'status_id',
        width: 120,
        filters: statusData,
        render: (statusId) => {
          const statusText = statusData.find(item => item.value === statusId) || { text: '审核中' };
          return statusText.text || '';
        },
      },
      {
        title: '参与人',
        dataIndex: 'participants.staff_name',
        width: 200,
        tooltip: true,
        searcher: true,
        render: (_, record) => {
          const { participants } = record;
          const staffName = participants.map(item => item.staff_name);
          return (
            <Ellipsis tooltip lines={1}>{staffName.join('、')}</Ellipsis>
          );
        },
      },
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
      {
        title: '记录人',
        dataIndex: 'recorder_name',
        width: 110,
        searcher: true,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 100,
        render: (record) => {
          return (
            <a
              style={{ color: '#59c3c3' }}
              onClick={() => {
                this.setState({ editInfo: record }, () => {
                  const { onClose } = this.props;
                  onClose(true);
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
          scroll={{ x: 1000, y: 180 }}
          columns={this.makeColums()}
          data={reuslt && reuslt.data}
          total={reuslt && reuslt.total}
          fetchDataSource={this.fetch}
        />
        <EventInfo
          type={type}
          id={editInfo.id || null}
          visible={visible}
          onClose={onClose}
        />
      </React.Fragment>
    );
  }
}
