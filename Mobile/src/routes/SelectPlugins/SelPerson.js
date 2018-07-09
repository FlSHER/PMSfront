import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { SearchList, Nothing } from '../../components/index';
import { Department, Staff } from '../../common/ListView/index.js';
import { analyzePath, unique, userStorage } from '../../utils/util';
import styles from '../common.less';
import style from './index.less';
@connect(({ searchStaff, loading }) => ({
  department: searchStaff.department,
  staff: searchStaff.staff,
  breadCrumb: searchStaff.breadCrumb,
  pageInfo: searchStaff.pageInfo,
  selectStaff: searchStaff.selectStaff,
  loading1: loading.effects['searchStaff/fetchSearchStaff'],
  loading2: loading.effects['searchStaff/fetchSelfDepStaff'],
  loading3: loading.effects['searchStaff/fetchFirstDepartment'],
}))
export default class SelPerson extends Component {
  state = {
    selected: {
      data: [],
      total: 50,
      num: 0,
    },
    selectAll: false,
    search: '',
    key: '', // 选的什么人
    type: 2, // 选的类型，单选还是多选
  };

  componentWillMount() {
    const key = analyzePath(this.props.location.pathname, 1);
    const type = analyzePath(this.props.location.pathname, 2);
    if (key === 'final') { // 终审人
      this.getFinalStaff();
    } else {
      this.fetchSelfDepStaff();
    }
    this.setState({
      key,
      type,
    });
  }

  onSearch = (search) => {
    const { dispatch } = this.props;
    this.setState({
      search,
    }, () => {
      dispatch({
        type: 'searchStaff/serachStaff',
        payload: `filters=realname~${search}&page=1&pagesize=15`,
      });
    });
  }

  onPageChange = () => {
    const { dispatch, pageInfo } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'searchStaff/serachStaff',
      payload: `filters=realname~${search}&page=${pageInfo.page + 1}&pagesize=15`,
    });
  }
  getSelectResult = (result) => {
    const { selected, type } = this.state;
    if (type === '1') {
      this.getSingleSelect(result);
    } else {
      this.setState({
        selected: {
          ...selected,
          data: result,
          num: result.length,
        },
      });
    }
  }
  getSingleSelect = (result) => {
    const { history, selectStaff, dispatch } = this.props;
    const { key } = this.state;
    const newSelectstaff = { ...selectStaff };
    newSelectstaff[key] = [result];
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectstaff,
      },
    });
    history.goBack(-1);
  }
  getFinalStaff = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/getFinalStaff',
    });
  }
  fetchSelfDepStaff =() => {
    const { dispatch } = this.props;
    const user = userStorage('userInfo');
    dispatch({
      type: 'searchStaff/fetchSelfDepStaff',
      payload: { departmentId: user.department.id },
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
    if (parentId === '-1') {
      this.firstDepartment();
    } else {
      this.fetchSearchStaff({
        parentId,
        breadCrumb: newBread,
      });
    }
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
    selected.total = 50;

    this.setState({
      selected,
      selectAll: !selectAll,
    });
  }
  firstDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/fetchFirstDepartment',
      payload: {
        breadCrumb: [{ name: '联系人', id: '-1' }],
      },
    });
  }
  searchOncancel = () => {
    this.setState({
      search: '',
    });
    const { breadCrumb } = this.props;
    if (breadCrumb && breadCrumb.length) {
      this.selDepartment(breadCrumb[breadCrumb.length - 1]);
    } else {
      this.fetchSelfDepStaff();
    }
  }
  selectOk = () => {
    const { history, selectStaff, dispatch } = this.props;
    const { selected, key } = this.state;
    const newSelectstaff = { ...selectStaff };
    const tmpSelected = selectStaff[key].concat(selected.data);
    newSelectstaff[key] = unique(tmpSelected, 'staff_sn');
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key: 'selectStaff',
        value: newSelectstaff,
      },
    });
    history.goBack(-1);
  }
  render() {
    const { department, staff, breadCrumb, loading1, loading2, loading3, pageInfo } = this.props;
    const { selected, type, search } = this.state;
    return (
      <div className={styles.con}>
        <SearchList
          multiple={type !== '1'}
          name="realname"
          isFinal={this.state.key === 'final'}
          bread={breadCrumb}
          checkAble={staff.length && (selected.num === staff.length)}
          selected={selected}
          checkedAll={this.checkedAll}
          handleSearch={this.onSearch}
          handleBread={this.selDepartment}
          firstDepartment={this.firstDepartment}
          selectOk={this.selectOk}
          searchOncancel={this.searchOncancel}
        >
          <div
            className={style.child}
            style={{ ...(loading1 || loading2 || loading3 ? { display: 'none' } : null) }}
          >
            {department.length && !search ? (
              <Department
                dataSource={department}
                heightNone
                fetchDataSource={this.selDepartment}
                name="id"
              />
              ) : null}
            {search && !staff.length ? <Nothing /> : null }
            {staff.length ? (
              <Staff
                link=""
                heightNone
                isFinal={this.state.key === 'final'}
                name={this.state.key === 'final' ? 'staff_name' : 'realname'}
                page={search ? pageInfo.page : false}
                totalpage={search ? pageInfo.totalpage : false}
                onPageChange={this.onPageChange}
                dispatch={this.props.dispatch}
                multiple={type !== '1'}
                selected={selected.data}
                dataSource={staff}
                onChange={this.getSelectResult}
              />
              ) : null}
          </div>

        </SearchList>
      </div>
    );
  }
}
