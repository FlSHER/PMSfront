import React, { Component } from 'react';
import {
  connect
} from 'dva';
import { SearchList } from '../../components/index'
import { Department, Staff } from '../../components/ListView/index.js'
import styles from '../common.less'
import style from './index.less'
class SelPerson extends Component {
  state = {
    selected: {
      data: [],
      total: 3,
      num: 0
    },
    selectAll: false
  };

  selDepartment = (department_id) => {
    const { dispatch, example: { bread } } = this.props
    console.log('department_id', department_id, bread)
    let bread_ = [...bread]
    bread_.push({ name: new Date().getTime(), id: new Date().getTime() })
    dispatch({
      type: 'example/save',
      payload: {
        department: [{ name: new Date().getTime(), id: new Date().getTime() }]
      }
    })
    dispatch({
      type: 'example/save',
      payload: {
        bread: bread_
      }
    })
    dispatch({
      type: 'example/save',
      payload: {
        staff: [
          { name: new Date().getTime(), id: 1 },
          { name: new Date().getTime(), id: 2 },
          { name: new Date().getTime(), id: 3 },

        ]
      }
    })
  }
  checkedAll = () => {//全选
    const { example: { staff } } = this.props
    const { selectAll } = this.state
    let selected = {
    }
    if (selectAll) {
      selected.data = []
      selected.num = 0
    }
    else {
      selected.data = [...staff]
      selected.num = staff.length
    }
    selected.total = 3

    this.setState({
      selected,
      selectAll: !selectAll
    })
  }

  getSelectResult = (result) => { //获取选择结果
    console.log('result', result)
    // const { example: { staff } } = this.props
    // const { selected } = this.state
    // let data = [...selected.data]
    // const staffId = data.map(item => item.id);
    // const oldData = data.filter(item => result.includes(item.id));

    // const newStaffId = result.filter(id => !staffId.includes(id));
    // const newData = staff.filter(item => newStaffId.includes(item.id));
    // data = [...oldData, ...newData];
    // this.setState({
    //   selected: {
    //     ...selected,
    //     data,
    //     num: data.length,
    //   }
    // })
  }

  onSearch = (search) => {
    const { dispatch } = this.props
    console.log('search', search)
    dispatch({
      type: 'example/save',
      payload: {
        staff: [
          { name: new Date().getTime(), id: 1 },
          { name: new Date().getTime(), id: 2 },
        ]
      }
    })
  }

  onChangeBread = (item) => {
    const { example: { bread }, dispatch } = this.props
    let index = 0
    bread.find((its, i) => {
      if (its.id == item.id) {
        index = i
      }
    })
    const bread_ = bread.filter((its, i) => index > i - 1)
    dispatch({
      type: 'example/save',
      payload: {
        bread: [...bread_]
      }
    })
    dispatch({
      type: 'example/save',
      payload: {
        department: [{ name: new Date().getTime(), id: new Date().getTime() }]
      }
    })
  }
  render() {
    const { example } = this.props
    const { bread, department, staff } = example
    const { selected } = this.state
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <SearchList
            bread={bread}
            multiple
            count={staff.length}
            selected={selected}
            checkedAll={this.checkedAll}
            handleSearch={this.onSearch}
            handleBread={this.onChangeBread}
          >
            <div className={style.child}>
              <Department
                dataSource={department}
                fetchDataSource={this.selDepartment}
                name="id"
              />
              <div style={{ marginBottom: '0.25rem' }}></div>
              <Staff
                link=""
                name="id"
                multiple
                selected={selected.data}
                dataSource={staff}
                onChange={this.getSelectResult}
              />
            </div>
          </SearchList>
        </div>
      </div>
    );
  }
}


export default connect(({ example }) => ({ example }))(SelPerson);