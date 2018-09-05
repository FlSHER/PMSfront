import React from 'react';
import { connect } from 'dva';
import EventInfo from '../../Reward/MyBuckle/info';
import BasicsInfo from './info';
import OATable from '../../../components/OATable';


@connect(({ point, loading }) => ({
  list: point.pointDetails,
  type: point.type,
  source: point.source,
  loading: (
    loading.effects['point/fetchDetail'] ||
    loading.effects['point/fetchSource'] ||
    loading.effects['point/fetchType']
  ),
}))
export default class extends React.PureComponent {
  state = {
    editInfo: {},
    visible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchType' });
    dispatch({ type: 'point/fetchSource' });
  }

  makeParams = (params) => {
    const { staffSn } = this.props;
    const newParams = { ...params };
    if (staffSn) newParams.staff_sn = staffSn;
    return newParams;
  }

  fetch = (params) => {
    const { dispatch } = this.props;
    const newParams = this.makeParams(params);
    dispatch({
      type: 'point/fetchDetail',
      payload: newParams,
    });
  }

  makeColums = () => {
    const point = (value) => {
      if (value > 0) return `+${value}`;
      if (value < 0) return `${value}`;
      return value;
    };
    const { source } = this.props;
    const data = this.props.type;
    const type = data.map(item => ({ text: item.name, value: item.id }));
    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
        tooltip: true,
        searcher: true,
      },
      {
        width: 150,
        title: 'A分变化',
        dataIndex: 'point_a',
        rangeFilters: true,
        render: point,
      },
      {
        width: 150,
        title: 'B分变化',
        dataIndex: 'point_b',
        rangeFilters: true,
        render: point,
      },
      {
        width: 150,
        title: '变化时间',
        dataIndex: 'changed_at',
        sorter: true,
      },
      {
        width: 150,
        title: '积分类型',
        dataIndex: 'type_id',
        filters: type,
        render: (key) => {
          const value = type.find(item => item.value === key) || {};
          return value.text || '';
        },
      },
      {
        width: 150,
        title: '积分来源',
        dataIndex: 'source_id',
        filters: source.map(item => ({ value: item.id, text: item.name })),
        render: (key) => {
          const value = source.find(item => item.id === key) || {};
          return value.name || '';
        },
      },
      {
        width: 165,
        title: '记录时间',
        dataIndex: 'created_at',
        sorter: true,
        defaultSortOrder: 'desced',
      },
      {
        title: '初审人',
        dataIndex: 'first_approver_name',
        width: 150,
        searcher: true,
      },
      {
        title: '终审人',
        dataIndex: 'final_approver_name',
        width: 150,
        searcher: true,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 110,
        render: (_, record) => {
          let a = { style: { color: '#c8c8c8' } };
          if (record.source_id === 2 || record.source_id === 1) {
            a = {
              style: { color: '#59c3c3' },
              onClick: () => { this.setState({ editInfo: record, visible: true }); },
            };
          }
          return (
            <React.Fragment>
              <a {...a}>查看{record.source_id === 1 ? '详情' : '事件'}</a>
            </React.Fragment>
          );
        },
      },
    ];
    return columns;
  }


  render() {
    const { list, loading } = this.props;
    const { editInfo, visible } = this.state;
    return (
      <div style={{ margin: '0px 10px 0' }}>
        <OATable
          serverSide
          autoScroll
          loading={loading}
          scroll={{ x: 1400 }}
          columns={this.makeColums()}
          data={list.data}
          total={list.total}
          fetchDataSource={this.fetch}
        />
        {editInfo.source_id === 1 ? (
          <BasicsInfo
            visible={visible}
            id={editInfo.source_foreign_key || null}
            onClose={() => {
              this.setState({ editInfo: {}, visible: false });
            }}
          />
        ) :
          (
            <EventInfo
              type="participant"
              id={editInfo.source_foreign_key || null}
              visible={visible}
              onClose={() => {
                this.setState({ editInfo: {}, visible: false });
              }}
            />
          )}

      </div>
    );
  }
}
