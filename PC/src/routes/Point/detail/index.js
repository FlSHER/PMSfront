import React from 'react';
import { connect } from 'dva';
import EventInfo from '../../Reward/MyBuckle/info';
import OATable from '../../../components/OATable';

@connect(({ point, loading }) => ({
  list: point.pointDetails,
  source: point.source,
  loading: (
    loading.effects['point/fetchDetail']
    ||
    loading.effects['point/fetchSource']
  ),
}))
export default class extends React.PureComponent {
  state = {
    editInfo: {},
    visible: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'point/fetchSource' });
  }

  fetch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'point/fetchDetail',
      payload: params,
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
        sortOrder: 'desced',
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
          if (record.source_id === 2) {
            a = {
              style: { color: '#59c3c3' },
              onClick: () => { this.setState({ editInfo: record, visible: true }); },
            };
          }
          return (<a {...a}>查看事件</a>);
        },
      },
    ];
    return columns;
  }


  render() {
    const { list, loading } = this.props;
    const { editInfo, visible } = this.state;

    return (
      <div style={{ margin: '30px 30px 0' }}>
        <OATable
          serverSide
          autoScroll
          loading={loading}
          scroll={{ x: 1400 }}
          columns={this.makeColums()}
          data={list && list.data}
          total={list && list.total}
          fetchDataSource={this.fetch}
        />
        <EventInfo
          type="participant"
          id={editInfo.source_foreign_key || null}
          visible={visible}
          onClose={() => {
            this.setState({ editInfo: {}, visible: false });
          }}
        />
      </div>
    );
  }
}
