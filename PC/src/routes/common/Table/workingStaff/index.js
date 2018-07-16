import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import OATable from '../../../../components/OATable';
import ModalStaff from './modalStaff';

const { EdiTableCell } = OATable;
@connect()
export default class WorkingStaff extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      visible: false,
    };
  }

  handleModalVisible = (flag) => {
    this.setState({ visible: !!flag });
  }

  handleOnChange = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(value);
  }

  handleTableOnChange = (staffSn, dataIndex) => {
    return (value) => {
      const dataSource = this.state.value;
      const newDataSource = [...dataSource];
      const target = newDataSource.find(item => item.staff_sn === staffSn);
      if (target) {
        target[dataIndex] = value;
        this.setState({ value: [...newDataSource] }, this.handleOnChange);
      }
    };
  }

  ediTableCell = (value, record) => {
    return (dataIndex) => {
      return (
        <EdiTableCell
          value={value ? value.toString() : '0'}
          type="number"
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
        render: this.ediTableCell('point_a'),
      },
      {
        title: '单次B分',
        dataIndex: 'point_b',
        render: this.ediTableCell('point_b'),
      },
      {
        title: '次数',
        dataIndex: 'number',
        render: this.ediTableCell('number'),
      },
      {
        title: '总分',
        dataIndex: 'count',
        render: (_, record) => {
          return `A:${record.point_a * number}  B:${record.point_b * number}`;
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
        className="cust-button"
        style={{ fontSize: 12 }}
        onClick={() => { this.handleModalVisible(true); }}
      >
        添加参与人
      </Button>
    )];
    if (!value.length) {
      extraOperator.push(
        <Button
          key="bars"
          icon="bars"
          type="default"
        >
          批量操作
        </Button>
      );
    }
    const response = {
      columns: this.makeColumns(),
      dataSource: value,
      extraOperator,
      sync: false,
      tableVisible: value.length,
    };
    return response;
  }

  render() {
    const { visible } = this.state;
    return (
      <div style={{ paddingTop: 5, width: 560 }}>
        <OATable
          {...this.makeTableProps()}
        />
        <ModalStaff visible={visible === false} />
      </div>
    );
  }
}
WorkingStaff.defaultProps = {
  onChange: () => { },
};
