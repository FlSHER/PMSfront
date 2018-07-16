import React from 'react';
import { connect } from 'dva';
import OAModal from '../../../../components/OAModal';
import SelectTable from '../../../../components/OAForm/SearchTable/selectTable';

const data = [
  {
    staff_sn: 1,
    realname: 'jyy',
    brand_id: '总监',
    position_id: '总监',
    department_id: '总监',
    status_id: '在职',
  },
];

@connect()
export default class ModalStaff extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
    };
  }

  setSelectedValue = (staff) => {
    this.setState({ value: staff });
  }

  handleOnChange = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(value);
  }

  fetchStaff = (params) => {
    console.log(params);
  }

  makeColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        searcher: true,
      }, {
        title: '姓名',
        align: 'center',
        dataIndex: 'realname',
        searcher: true,
      }, {
        title: '品牌',
        align: 'center',
        dataIndex: 'brand_id',
      }, {
        title: '职位',
        dataIndex: 'position_id',
      }, {
        title: '部门',
        dataIndex: 'department_id',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        align: 'center',
      },
    ];
  }


  makeTableProps = () => {
    const { value } = this.state;
    const response = {
      index: 'staff_sn',
      data,
      value,
      total: null,
      loading: false,
      multiple: true,
      columns: this.makeColumns(),
      fetchDataSource: this.fetchStaff,
      setSelectedValue: this.setSelectedValue,
    };
    return response;
  }

  makeModalProps = () => {
    const { visible } = this.props;
    const response = {
      visible,
      width: 950,
    };
    return response;
  }

  render() {
    return (
      <div style={{ paddingTop: 5, width: 560 }}>
        <OAModal {...this.makeModalProps()} >
          <SelectTable {...this.makeTableProps()} />
        </OAModal>
      </div>
    );
  }
}
ModalStaff.defaultProps = {
  onChange: () => { },
  visible: false,
};
