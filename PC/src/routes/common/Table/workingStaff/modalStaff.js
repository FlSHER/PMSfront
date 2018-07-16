import React from 'react';
import { connect } from 'dva';
import OAModal from '../../../../components/OAModal';
import SelectTable from '../../../../components/OAForm/SearchTable/selectTable';

const data = [
  {
    staff_sn: 110105,
    realname: '张博涵',
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
    this.pushValue = [];
    const value = this.makeInitialValue(props.value || []);
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.value, this.props.value);
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      const value = this.makeInitialValue(nextProps.value || []);
      this.setState({ value: [...value] });
    }
  }

  setSelectedValue = (rowDatas) => {
    this.pushValue = rowDatas;
  }


  fetchStaff = (params) => {
    console.log(params);
  }


  handleOnChange = () => {
    this.setState({ value: this.pushValue }, () => {
      const { onChange } = this.props;
      const value = this.makeNameFieldsValue();
      // console.log(value);
      onChange(value);
    });
  }

  makeInitialValue = (value) => {
    const { name } = this.props;
    if (Object.keys(name).length) {
      let newValue = [];
      newValue = value.map((item) => {
        const temp = {};
        Object.keys(name).forEach((key) => {
          temp[name[key]] = item[key];
        });
        return temp;
      });
      return newValue;
    }
    return value;
  }

  makeNameFieldsValue = () => {
    const { name } = this.props;
    const { value } = this.state;
    let newValue = [...value];
    if (Object.keys(name).length) {
      newValue = [];
      value.forEach((item, i) => {
        newValue[i] = {};
        Object.keys(name).forEach((key) => {
          newValue[i][key] = item[name[key]];
        });
      });
    }
    return newValue;
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
    const { visible, onCancel } = this.props;
    const response = {
      visible,
      width: 950,
      title: '选择参与人',
      onOk: this.handleOnChange,
      destroyOnClose: false,
      onCancel: () => onCancel(false),
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
  name: {},
  onChange: () => { },
};
