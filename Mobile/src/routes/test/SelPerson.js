import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { SearchList } from '../../components/index';
import { Department, Staff } from '../../common/ListView/index.js';
import styles from '../common.less';
import style from './index.less';
@connect(({ example, searchStaff, loading }) => ({
  example,
  department: searchStaff.department,
  staff: searchStaff.staff,
  breadCrumb: searchStaff.breadCrumb,
  pageInfo: searchStaff.pageInfo,
  loading: loading.effects['searchStaff/fetchSelfDepStaff'],
}))
export default class SelPerson extends Component {
  state = {
    selected: {
      data: [],
      total: 3,
      num: 0,
    },
    selectAll: false,
  };

  componentWillMount() {
    // this.fetchSearchStaff({ parentId: 7, breadCrumb: [{ name: '联系人', id: 0 }] });
    this.fetchSelfDepStaff();
  }


  onSearch = (search) => {
    // const newSearch = search;
    const { dispatch } = this.props;
    // this.setState({
    //   search: newSearch,
    // });
    dispatch({
      type: 'searchStaff/serachStaff',
      payload: `filters=realname~${search}&page=1&pagesize=15`,
    });

    return search;
  }


  getSelectResult = (result) => {
    const { selected } = this.state;
    this.setState({
      selected: {
        ...selected,
        data: result,
        num: result.length,
      },
    });
  }
  fetchSelfDepStaff =() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchSelfDepStaff',
      payload: { departmentId: 7 },
    });
  }

  fetchSearchStaff = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchSearchStaff',
      payload: params,
    });
  }

  makeBreadCrumbData = (params) => {
    const { breadCrumb } = this.props;
    let newBread = [...breadCrumb];
    let splitIndex = null;
    newBread.forEach((item, index) => {
      if (item.id === params.id) {
        splitIndex = index + 1;
      }
    });
    if (splitIndex !== null) {
      newBread = newBread.slice(0, splitIndex);
    } else {
      newBread.push(params);
    }
    return newBread;
  }

  selDepartment = (params) => {
    const newBread = this.makeBreadCrumbData(params);
    const parentId = params.id;
    this.fetchSearchStaff({
      parentId,
      breadCrumb: newBread,
    });
  }

  checkedAll = () => { // 全选
    const { staff } = this.props;
    const { selectAll } = this.state;
    const selected = {
    };
    if (selectAll) {
      selected.data = [];
      selected.num = 0;
    } else {
      selected.data = [...staff];
      selected.num = staff.length;
    }
    selected.total = 3;

    this.setState({
      selected,
      selectAll: !selectAll,
    });
  }
  firstDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchFirstDepartment',
    });
  }

  render() {
    const { department, staff, breadCrumb, loading, pageInfo } = this.props;
    const { selected } = this.state;
    return (
      <div className={styles.con}>
        <SearchList
          multiple
          name="realname"
          bread={breadCrumb}
          checkAble={staff.length && (selected.num === staff.length)}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.selDepartment}
          firstDepartment={this.firstDepartment}
        >
          {!loading ? (
            <div className={style.child}>
              {department.length ? (
                <Department
                  dataSource={department}
                  fetchDataSource={this.selDepartment}
                  name="id"
                />
              ) : null}
              {staff.length ? (
                <Staff
                  link=""
                  name="staff_sn"
                  page={pageInfo.page}
                  totalpage={pageInfo.totalpage}
                  dispatch={this.props.dispatch}
                  multiple
                  selected={selected.data}
                  dataSource={staff}
                  onChange={this.getSelectResult}
                />
              ) : null}
            </div>
          ) : null}
        </SearchList>
      </div>
    );
  }
}
