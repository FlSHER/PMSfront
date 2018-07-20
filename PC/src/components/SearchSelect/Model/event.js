import React from 'react';
import { connect } from 'dva';
import SearchSelect from '../SearchSelect';
import { ModalSelect } from '../../OAModal';
import { makerFilters } from '../../../utils/utils';

@connect(({ event, loading }) => ({
  dataSource: event.event,
  eventType: event.type,
  loading: loading.models.event,
}))

export default class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
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
    const columns = [
      {
        dataIndex: 'id',
        title: '编号',
        searcher: true,
      },
      {
        dataIndex: 'name',
        title: '名称',
        searcher: true,
      },
      {
        dataIndex: 'type_id',
        title: '事件类型',
        treeFilters: {
          title: 'name',
          value: 'id',
          parentId: 'parent_id',
          parentVal: null,
          data: eventType,
        },
        render: (typeId) => {
          const evetType = eventType.find(item => item.id === typeId);
          return evetType && evetType.name;
        },
      },
      {
        dataIndex: 'point_a_default',
        title: 'A分',
      },
      {
        dataIndex: 'point_b_default',
        title: 'B分',
      },
      {
        dataIndex: 'first_approver_name',
        title: '初审人',
        searcher: true,
      },
      {
        dataIndex: 'final_approver_name',
        title: '终审人',
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
      afterClick: () => this.handleVisible(true),
      dataSource: [],
      fetchDataSource: this.fetchEvent,
    };
    if (Array.isArray(dataSource)) {
      response.dataSource = dataSource.map(item => ({ value: item.id, text: item.name }));
    } else if (typeof dataSource === 'object') {
      response.dataSource = dataSource.data.map(item => ({ value: item.id, text: item.name }));
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
