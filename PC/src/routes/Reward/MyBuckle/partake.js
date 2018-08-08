import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import moment from 'moment';

import OATable from '../../../components/OATable';
import EventInfo from './info';
import { statusData, makerFilters } from '../../../utils/utils';


@connect(({ buckle, loading }) => ({
  buckle,
  loading: loading.effects['buckle/fetch'],
}))
export default class extends React.PureComponent {
  state = {
    editInfo: {},
  }

  fetch = (_, _params) => {
    let params = { ..._params };
    if (_params.filters.status_id) {
      if (typeof _params.filters.status_id === 'string') {
        const temp = _params.filters.status_id.split(',');
        params.filters.status_id = {};
        params.filters.status_id.in = temp;
      } else {
        const whereStatus = _params.filters.status_id.in;
        let status = [];
        whereStatus.forEach((item) => {
          const temp = item.split(',');
          status = [...status, ...temp];
        });
        params.filters.status_id.in = status;
      }
    }
    params = makerFilters(params);
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
    const { user } = window || { user: { staff_sn: '' } };
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
        align: 'center',
        width: 120,
        filters: statusData,
        render: (statusId) => {
          const statusText = statusData.find(item => item.value === statusId) || { text: '审核中' };
          return statusText.text || '';
        },
      },
      {
        title: '得分',
        dataIndex: 'participants',
        width: 220,
        render: (participants) => {
          const mePoint = participants.find(item => item.staff_sn === user.staff_sn) || {};
          return (
            <Tooltip title={(
              <React.Fragment>
                {`A：${mePoint.point_a * mePoint.count}（${mePoint.point_a}x${mePoint.count}） `}
                {`B：${mePoint.point_b * mePoint.count}（${mePoint.point_b}x${mePoint.count}）`}
              </React.Fragment>
            )}
            >
              <span style={{ width: 102, display: 'inline-block' }}>
                {`A：${mePoint.point_a * mePoint.count}`}
              </span>
              <span style={{ width: 102, display: 'inline-block' }}>
                {`B：${mePoint.point_b * mePoint.count}`}
              </span>
            </Tooltip>
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
          autoScroll
          id={type}
          loading={loading}
          scroll={{ x: 1200 }}
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
