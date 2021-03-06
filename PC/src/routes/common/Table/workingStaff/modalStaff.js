import React from 'react';
import { Tooltip } from 'antd';
import { connect } from 'dva';
import { ModalSelect } from '../../../../components/OAModal';
import { getBrandAuthority, getDepartmentAuthority } from '../../../../utils/utils';
/**
 * 定制插件开发的数据模型
 */
const status = [
  { value: 1, text: '试用期' },
  { value: 2, text: '在职' },
  { value: 3, text: '停薪留职' },
  { value: -1, text: '离职' },
  { value: -2, text: '自动离职' },
  { value: -3, text: '开除' },
  { value: -4, text: '劝退' },
];

@connect(({ staffs, department, brand, position, loading }) => ({
  brand: brand.brand,
  brandLoading: loading.models.brand,
  department: department.department,
  departmentLoading: loading.effects['department/fetchDepartment'],
  staffSearcherTotal: staffs.totalResult,
  staffSearcherResult: staffs.tableResult,
  staffsLoading: loading.effects['staffs/fetchStaff'],
  position: position.position,
  positionLoading: loading.models.position,
}))
export default class ModalStaff extends React.PureComponent {
  constructor(props) {
    super(props);
    this.pushValue = [];
    this.state = {
      value: props.value || [],
      filterPosition: [],
      staffSearcherParams: '',
    };
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch({ type: 'brand/fetchBrand' });
  //   dispatch({ type: 'position/fetchPosition' });
  //   dispatch({ type: 'department/fetchDepartment', payload: {} });
  // }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.setState({ value: [...nextProps.value] });
    }
    if (JSON.stringify(nextProps.position) !== JSON.stringify(this.props.position)) {
      this.setState({ filterPosition: nextProps.position });
    }
  }

  setSelectedValue = (rowDatas) => {
    this.pushValue = rowDatas;
  }


  /**
   *
   *定制开发插件内容：
   * 员工staff 搜索
   */

  fetchStaff = (params) => {
    const { dispatch, position } = this.props;
    let { filterPosition } = this.state;
    const newParams = { ...params };
    if (this.props.filters.content) {
      newParams.filters += this.props.filters.content;
    }
    dispatch({ type: 'staffs/fetchStaff', payload: newParams });
    dispatch({ type: 'brand/fetchBrand' });
    dispatch({ type: 'position/fetchPosition' });
    dispatch({ type: 'department/fetchDepartment', payload: {} });
    if (params.filters && params.filters.brand_id) {
      const pushPosition = this.makePositionData(params.filters.brand_id);
      if (pushPosition.length > 0) {
        filterPosition = pushPosition;
      }
    } else {
      filterPosition = position;
    }

    this.setState({
      filterPosition: [...filterPosition],
      staffSearcherParams: JSON.stringify(newParams),
    });
  };


  makePositionData = (params) => {
    const { brand } = this.props;
    let conditions = params;
    if (params.in) {
      conditions = params.in;
    }
    const selectBrand = brand.filter(item => conditions.indexOf(item.id.toString()) !== -1);
    const pushPosition = [];
    selectBrand.forEach((item) => {
      if (item.positions.length > 0) {
        item.positions.forEach((p) => {
          const pushIndex = pushPosition.map(index => index.id);
          if (pushIndex.indexOf(p.id) === -1) {
            pushPosition.push(p);
          }
        });
      }
    });
    return pushPosition;
  };

  makeFilters = () => {
    const { brand, department, authority, filters } = this.props;
    let filterPosition = [...this.state.filterPosition];
    let access = false;
    if (authority) {
      access = true;
    }

    let brandFilters = [];
    if (brand && access) {
      brand.forEach((item) => {
        if (getBrandAuthority(item.id)) {
          brandFilters.push({ text: item.name, value: item.id });
        }
      });
    } else {
      brandFilters = brand.map(item => ({ text: item.name, value: item.id }));
    }

    filterPosition = filterPosition.map((item) => {
      return { text: item.name, value: item.id };
    });

    const newDepartment = department.map((item) => {
      const temp = { ...item };
      if (access) {
        temp.disabled = !getDepartmentAuthority(item.id);
      }
      return temp;
    });

    let newStatus = [...status];
    if (filters.status) {
      newStatus = status.filter(item => filters.status.indexOf(item.value) !== -1);
    }

    return {
      brandFilters,
      filterPosition,
      newDepartment,
      newStatus,
    };
  }

  makeColumns = () => {
    const { brandFilters, filterPosition, newDepartment, newStatus } = this.makeFilters();
    const { brand, position, department } = this.props;

    return [
      {
        title: '编号',
        dataIndex: 'staff_sn',
        sorter: true,
        searcher: true,
        fixed: true,
        width: 110,
      }, {
        title: '姓名',
        dataIndex: 'realname',
        fixed: true,
        tooltip: true,
        searcher: true,
        width: 110,
      }, {
        title: '品牌',
        align: 'center',
        width: 100,
        dataIndex: 'brand_id',
        filters: brandFilters,
        render: (val) => {
          const data = brand.find(item => item.id === val);
          return data ? data.name : '';
        },
      }, {
        title: '职位',
        width: 100,
        dataIndex: 'position_id',
        filters: filterPosition,
        render: (val) => {
          const data = position.find(item => item.id === val);
          return data ? data.name : '';
        },
      }, {
        title: '部门',
        dataIndex: 'department_id',
        width: 200,
        treeFilters: {
          title: 'full_name',
          value: 'id',
          parentId: 'parent_id',
          data: newDepartment,
        },
        render: (val) => {
          const data = department.find(item => item.id === val);
          const fullName = data ? data.full_name : '';
          const content = (
            <Tooltip title={fullName} placement="right">
              {fullName}
            </Tooltip>
          );
          return content;
        },
      },
      {
        title: '状态',
        dataIndex: 'status_id',
        align: 'center',
        filters: newStatus,
        render: (val) => {
          const data = status.find(item => item.value === val);
          return data ? data.text : '';
        },
      },
    ];
  }

  handleOnChange = (value) => {
    this.setState({ value }, () => {
      const { onChange } = this.props;
      onChange(value);
    });
  }


  makeTableProps = () => {
    const { staffSearcherParams, value } = this.state;
    const {
      brandLoading,
      staffsLoading,
      positionLoading,
      departmentLoading,
      staffSearcherTotal,
      staffSearcherResult,
    } = this.props;
    const tableProps = {
      value,
      index: 'staff_sn',
      multiple: true,
      scroll: { x: 760 },
      total: staffSearcherTotal[staffSearcherParams],
      data: staffSearcherResult[staffSearcherParams],
      loading: (staffsLoading || brandLoading || departmentLoading || positionLoading),
      fetchDataSource: this.fetchStaff,
    };
    tableProps.columns = this.makeColumns();
    return tableProps;
  };

  makeModalProps = () => {
    const { visible, onCancel } = this.props;
    const { value } = this.state;
    const response = {
      modalProps: {
        visible,
        width: 800,
        title: '选择参与人',
      },
      value,
      onCancel: () => onCancel(),
      multiple: true,
      onChange: this.handleOnChange,
      ...this.makeTableProps(),
    };
    return response;
  }

  render() {
    return (
      <ModalSelect {...this.makeModalProps()} />
    );
  }
}
ModalStaff.defaultProps = {
  name: {},
  filters: {},
  onChange: () => { },
};
