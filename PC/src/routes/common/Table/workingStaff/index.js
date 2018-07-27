import React from 'react';
import { Button, Icon } from 'antd';
import OATable from '../../../../components/OATable';
import ModalStaff from './modalStaff';
import BatchForm from './batchForm';

const { EdiTableCell } = OATable;

const valueDefault = {
  number: 1,
  count: 0,
};

export default class WorkingStaff extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      batchInitValue: [],
      visible: false,
      batchVisible: false,
    };
  }

  verifyCurrentUser = () => {
    const { value } = this.state;
    const { user } = window;
    const deleteUserStatus = value.find(item => item.staff_sn === user.staff_sn);
    return deleteUserStatus;
  }

  handleBatch = (staffSn) => {
    this.setState({ batchInitValue: [...staffSn] }, () => this.handleModalVisible('batchVisible', true));
  }

  handleBatchChange = (params) => {
    const { value, batchInitValue } = this.state;
    const newValue = value.map((item) => {
      if (batchInitValue.indexOf(item.staff_sn) !== -1) {
        return {
          ...item,
          point_a: params.point_a || item.point_a,
          point_b: params.point_b || item.point_b,
          number: params.number || item.number,
        };
      }
      return item;
    });
    this.setState({ value: [...newValue] }, () => {
      this.handleModalVisible('batchVisible');
      this.handleOnChange();
    });
  }

  handleModalVisible = (visible, flag) => {
    this.setState({ [visible]: !!flag });
  }

  handleOnChange = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(value);
  }

  handleModalStaffOnChange = (value) => {
    const stateValue = [...this.state.value];
    const { defaultPoint } = this.props;
    const staffSn = stateValue.map(item => item.staff_sn);
    const pushValue = value.filter(item => staffSn.indexOf(item.staff_sn) === -1);
    pushValue.forEach((item) => {
      stateValue.push({
        staff_sn: item.staff_sn,
        staff_name: item.realname,
        ...valueDefault,
        ...defaultPoint,
      });
    });
    this.setState({ value: stateValue }, () => {
      this.handleModalVisible('visible');
      this.handleOnChange();
    });
  }

  handleTableOnChange = (staffSn, dataIndex) => {
    return (value) => {
      const dataSource = this.state.value;
      const newDataSource = [...dataSource];
      const target = newDataSource.find(item => item.staff_sn === staffSn);
      if (target) {
        target[dataIndex] = value || 0;
        this.setState({ value: [...newDataSource] }, this.handleOnChange);
      }
    };
  }

  handleDelete = (staffSn) => {
    const dataSource = this.state.value;
    const newDataSource = dataSource.filter((item) => {
      return staffSn.indexOf(item.staff_sn) === -1;
    });
    const { selectedRows, selectedRowKeys } = this.oatable.state;
    this.oatable.state.selectedRows = selectedRows.filter((item) => {
      return staffSn.indexOf(item.staff_sn) === -1;
    });
    this.oatable.state.selectedRowKeys = selectedRowKeys.filter(item =>
      (staffSn.indexOf(item) === -1)
    );
    this.setState({ value: newDataSource }, this.handleOnChange);
  }

  addCurrentUser = () => {
    const { value } = this.state;
    const { user } = window;
    const { defaultPoint } = this.props;
    value.push({
      staff_sn: user.staff_sn,
      staff_name: user.realname,
      ...valueDefault,
      ...defaultPoint,
    });
    this.setState({ value: [...value] }, this.handleOnChange);
  }

  ediTableCell = (dataIndex) => {
    return (value, record) => {
      return (
        <EdiTableCell
          type="number"
          value={value ? value.toString() : '0'}
          onChange={this.handleTableOnChange(record.staff_sn, dataIndex)}
        />
      );
    };
  }

  makeColumns = () => {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'staff_name',
      },
      {
        title: '单次A分',
        dataIndex: 'point_a',
        width: 80,
        render: this.ediTableCell('point_a'),
      },
      {
        title: '单次B分',
        dataIndex: 'point_b',
        width: 80,
        render: this.ediTableCell('point_b'),
      },
      {
        title: '次数',
        dataIndex: 'number',
        width: 80,
        render: this.ediTableCell('number'),
      },
      {
        title: '总分',
        dataIndex: 'count',
        render: (_, record) => {
          const number = parseInt(record.number, 10);
          const aPoint = parseInt(record.point_a, 10) * number;
          const bPoint = parseInt(record.point_b, 10) * number;
          return (
            <div style={{ color: 'rgb(150, 150, 150)' }}>
              <span style={{ marginRight: '20px' }}>{`A：${aPoint}`}</span>
              <span>{`B：${bPoint}`}</span>
            </div>
          );
        },
      },
      {
        dataIndex: 'staff_sn',
        render: (staffSn) => {
          return (
            <span
              style={{ cursor: 'pointer', color: 'red', lineHeight: '22px' }}
              onClick={() => this.handleDelete([staffSn])}
            >
              删除
            </span>
          );
        },
      },
    ];
    return columns;
  }


  makeTableProps = () => {
    const { value } = this.state;
    const extraOperator = [(
      <Button
        key="plus"
        icon="user-add"
        type="primary"
        style={{ fontSize: 12 }}
        onClick={() => { this.handleModalVisible('visible', true); }}
      >
        添加参与人
      </Button>
    )];

    const multiOperator = [
      { text: '批量修改', action: selectedRows => this.handleBatch(selectedRows.map(row => row.staff_sn)) },
      { text: '批量删除', action: selectedRows => this.handleDelete(selectedRows.map(row => row.staff_sn)) },
    ];

    const deleteUserStatus = this.verifyCurrentUser();
    const userAddClick = !deleteUserStatus ? { onClick: this.addCurrentUser } : null;
    const extraOperatorRight = (
      <span style={{ color: '#59c3c3', fontSize: '12px', cursor: 'pointer' }} {...userAddClick} >
        <Icon type="user-add" style={{ marginRight: '5px' }} />添加本人
      </span>
    );
    const response = {
      rowKey: (record) => {
        return record.staff_sn;
      },
      sync: false,
      pagination: false,
      columns: this.makeColumns(),
      dataSource: value,
      extraOperator,
      extraOperatorRight,
      multiOperator,
      tableVisible: value.length > 0,
    };
    return response;
  }

  render() {
    const { visible, batchVisible } = this.state;
    return (
      <div style={{ width: 540 }}>
        <OATable
          ref={(e) => { this.oatable = e; }}
          {...this.makeTableProps()}
        />
        <ModalStaff
          visible={visible}
          // value={value}
          onChange={this.handleModalStaffOnChange}
          filters={{ content: 'status_id>=0;', status: [1, 2, 3] }}
          onCancel={() => this.handleModalVisible('visible', false)}
        />
        <BatchForm
          visible={batchVisible}
          handleChange={this.handleBatchChange}
          onCancel={() => this.handleModalVisible('batchVisible', false)}
        />
      </div>
    );
  }
}
WorkingStaff.defaultProps = {
  onChange: () => { },
};
