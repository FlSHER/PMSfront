import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import SearchSelectRadio from '../Radio';
import { makerFilters, findTreeParent } from '../../../utils/utils';
import './ellipsis.less';


@connect(({ event, loading }) => ({
  dataSource: event.event,
  eventType: event.type,
  loading: loading.models.event,
}))

export default class extends React.Component {
  fetchEventType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'event/fetchEventType',
      payload: {},
    });
  }

  fetchEvent = (params) => {
    let newParams;
    const { dispatch } = this.props;
    if (params.length && !params.page) {
      newParams = makerFilters({
        filters: { name: { like: params } },
      });
    } else if (Object.keys(params).length) {
      newParams = params;
      this.fetchEventType();
    }
    if (newParams) {
      dispatch({
        type: 'event/fetchEvent',
        payload: newParams,
      });
    }
  }

  makeColumns = () => {
    const { eventType } = this.props;
    const columns = [
      {
        dataIndex: 'id',
        title: '编号',
        searcher: true,
        sorter: true,
        width: 100,
      },
      {
        dataIndex: 'name',
        title: '名称',
        searcher: true,
        width: 230,
        render: (name) => {
          return (
            <Tooltip title={name}>
              <div className="ellipsis" style={{ width: 230 }}>{name}</div>
            </Tooltip>
          );
        },
      },
      {
        dataIndex: 'type_id',
        title: '事件类型',
        width: 230,
        treeFilters: {
          title: 'name',
          value: 'id',
          parentId: 'parent_id',
          parentVal: null,
          data: eventType,
        },
        render: (typeId) => {
          const findData = findTreeParent(eventType, typeId);
          const listName = findData.reverse().map(item => item.name);
          const name = listName.join('>');
          return (
            <Tooltip title={name}>
              <div className="ellipsis" style={{ width: 230 }}>{name}</div>
            </Tooltip>
          );
        },
      },
      {
        dataIndex: 'point_a_default',
        title: 'A分',
        rangeFilters: true,
        width: 100,
      },
      {
        dataIndex: 'point_b_default',
        title: 'B分',
        width: 100,
        rangeFilters: true,
      },
      {
        dataIndex: 'first_approver_name',
        title: '初审人',
        width: 100,
        searcher: true,
      },
      {
        dataIndex: 'final_approver_name',
        title: '终审人',
        width: 100,
        searcher: true,
      },
    ];
    return columns;
  }

  makeSearchSelectProps = () => {
    const { dataSource, value } = this.props;
    const response = {
      ...this.props,
      valueOBJ: value,
      fetchDataSource: this.fetchEvent,
    };
    if (Array.isArray(dataSource)) {
      response.dataSource = dataSource;
      response.selectedData = dataSource;
    } else if (Object.keys(dataSource).length) {
      response.selectedData = dataSource.data;
    }
    return response;
  }

  makeModalSelectProps = () => {
    const { dataSource, loading, name, value } = this.props;
    const response = {
      loading,
      name,
      value,
      index: 'id',
      data: [],
      columns: this.makeColumns(),
      scroll: { x: 1000 },
      modalProps: {
        title: '选择事件',
      },
    };
    if (Array.isArray(dataSource)) {
      response.dataSource = dataSource;
    } else {
      response.data = dataSource && dataSource.data;
      response.total = dataSource && dataSource.total;
    }
    return response;
  }

  render() {
    return (
      <SearchSelectRadio
        {...this.makeSearchSelectProps()}
        modalSelectProps={{ ...this.makeModalSelectProps() }}
      />
    );
  }
}
