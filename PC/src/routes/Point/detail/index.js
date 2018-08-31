import React from 'react';
import { connect } from 'dva';
import EventInfo from '../../Reward/MyBuckle/info';
import BasicsInfo from './info';
import OATable from '../../../components/OATable';


@connect(({ point, loading }) => ({
  list: point.pointDetails,
  source: point.type,
  loading: (
    loading.effects['point/fetchDetail']
    ||
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
    const data = this.props.source;
    const source = data.map(item => ({ text: item.name, value: item.id }));
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
        title: '积分来源',
        dataIndex: 'source_id',
        filters: source,
        render: (value) => {
          const sourceText = source.find(item => item.value === value) || {};
          return sourceText.text || '';
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
        width: 100,
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
              <a {...a}>查看事件</a>
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
            type="participant"
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
