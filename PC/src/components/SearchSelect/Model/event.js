import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import SearchSelect from '../SearchSelect';
import { ModalSelect } from '../../OAModal';
import { makerFilters, findTreePerant } from '../../../utils/utils';
import './ellipsis.less';


@connect(({ event, loading }) => ({
  dataSource: event.event,
  eventType: event.type,
  loading: loading.models.event,
}))

export default class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || null,
      visible: false,
    };
  }

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
    if (params && !params.page) {
      newParams = makerFilters({
        filters: { name: { like: params } },
      });
    } else if (params) {
      newParams = params;
      this.fetchEventType();
    }
    dispatch({
      type: 'event/fetchEvent',
      payload: newParams,
    });
  }

  handleVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  makeColumns = () => {
    const { eventType } = this.props;
    // const { isBigRatio } = getClientRatio();
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
          const findData = findTreePerant(eventType, typeId);
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
    const { dataSource } = this.props;
    const { value } = this.state;
    const response = {
      ...this.props,
      value,
      dataSource: [],
      afterClick: () => this.handleVisible(true),
      fetchDataSource: this.fetchEvent,
    };
    if (Array.isArray(dataSource)) {
      response.dataSource = dataSource.map(item => ({ value: item.id, text: item.name }));
    }
    return response;
  }


  makeModalSelectProps = () => {
    const { visible } = this.state;
    const { dataSource, loading } = this.props;
    const response = {
      visible,
      index: 'id',
      data: [],
      loading,
      columns: this.makeColumns(),
      onCancel: this.handleVisible,
      fetchDataSource: this.fetchEvent,
      scroll: { x: 1000 },
      modalProps: {
        title: '选择事件',
        width: 800,
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
      <React.Fragment>
        <SearchSelect {...this.makeSearchSelectProps()} />
        <ModalSelect {...this.makeModalSelectProps()} />
      </React.Fragment>
    );
  }
}
