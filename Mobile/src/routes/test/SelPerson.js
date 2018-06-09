import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { SearchList } from '../../components/index';
import { Department, Staff } from '../../components/ListView/index.js';
import styles from '../common.less';
import style from './index.less';
@connect(({ example, searchStaff, loading }) => ({
  example,
  department: searchStaff.department,
  staff: searchStaff.staff,
  breadCrumb: searchStaff.breadCrumb,
  loading: loading.effects['searchStaff/fetchSearchStaff'],
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

  componentDidMount() {
    this.fetchSearchStaff({ parentId: 0, breadCrumb: [] });
  }


  onSearch = (search) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'example/save',
      payload: {
        staff: [
          { name: new Date().getTime(), id: 1 },
          { name: new Date().getTime(), id: 2 },
        ],
      },
    });
    return search;
  }

  onChangeBread = (item) => {
    const { example: { bread }, dispatch } = this.props;
    let index = 0;
    bread.forEach((its, i) => {
      if (its.id === item.id) {
        index = i;
      }
    });

    const newBread = bread.filter((its, i) => index > i - 1);
    dispatch({
      type: 'example/save',
      payload: {
        bread: [...newBread],
      },
    });
    dispatch({
      type: 'example/save',
      payload: {
        department: [{ name: new Date().getTime(), id: new Date().getTime() }],
      },
    });
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


  fetchSearchStaff = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchSearchStaff',
      payload: params,
    });
  }

  selDepartment = (params) => {
    const { breadCrumb } = this.props;
    const newBread = [...breadCrumb];
    newBread.push({ name: new Date().getTime(), id: new Date().getTime() });
    const parentId = params.id;
    this.fetchSearchStaff({
      parentId,
      breadCrumb,
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


  render() {
    const { department, staff, breadCrumb, loading } = this.props;

    const { selected } = this.state;

    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <SearchList
            multiple
            name="realname"
            bread={breadCrumb}
            count={staff.length}
            selected={selected}
            checkedAll={this.checkedAll}
            handleSearch={this.onSearch}
            handleBread={this.onChangeBread}
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
      </div>
    );
  }
}
