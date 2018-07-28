import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import ModalFilters from '../components/ModalFilters';
import { doConditionValue, getUrlString, userStorage } from '../utils/util';


const tabs = {
  processing: {

    filterColumns: [
      {
        name: 'audit',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        usename: false,
        options: [
          {
            label: '初审', value: `first_approver_sn=${userStorage('userInfo').staff_sn}`,
          },
          {
            label: '终审', value: `final_approver_sn=${userStorage('userInfo').staff_sn}`,
          },
        ],
      },
    ],
  },
  approved: {
    filterColumns: [
      {
        name: 'audit',
        type: 'checkBox',
        title: '审核类型',
        multiple: false,
        usename: false,
        options: [
          {
            label: '初审', value: `first_approver_sn=${userStorage('userInfo').staff_sn}`,
          },
          {
            label: '终审', value: `final_approver_sn=${userStorage('userInfo').staff_sn}`,
          },
        ],
      },
      {
        name: 'status_id',
        type: 'checkBox',
        title: '审核类型',
        multiple: true,
        options: [
          {
            label: '已通过', value: 1,
          },
          {
            label: '已驳回', value: -1,
          },
        ],
      },
    ],
  },
};

const auditStates = [
  { name: '待审核', value: 'processing' },
  { name: '已审核', value: 'approved' },
];

@connect(({ alltabs, buckle }) => ({
  alltabs,
  auditList: buckle.auditList,
}))
export default class Nothing extends React.Component {
  state = {
    visible: false,
    model: 'sorts',
  }
  componentWillMount() {
    this.urlFilersParams = getUrlString('filters');
    this.urlSortParams = getUrlString('sort');
    console.log(this.urlFilersParams, this.urlSortParams);
    this.filters = doConditionValue(this.urlFilersParams);
    this.sorts = doConditionValue(this.urlSortParams);
    console.log('filters', this.filters, this.urlSortParams, this.sorts);
  }


  tabChange = (type) => {
    const { history } = this.props;
    // history.replace(`/test?type=${type}`);
  }


  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  fetchDataSource = (params) => {

  }

  render() {
    return (
      <div>
        {auditStates.map((item) => {
          return (
            <button
              key={item.name}
              onClick={() => this.tabChange(item.value)}
            >{item.name}
            </button>
          );
        })}
        <Button style={{ margin: 20 }} type="primary" size="small" inline onClick={() => this.handleVisible(true, 'filter')}>
          筛选
        </Button>
        <Button style={{ margin: 20 }} type="primary" size="small" inline onClick={() => this.handleVisible(true, 'sort')}>
          排序
        </Button>
        <ModalFilters
          visible={this.state.visible}
          model={this.state.model}
          filters={this.filters}
          sorter="created_at-asc"
          modalId="1"
          fetchDataSource={this.fetchDataSource}
          onCancel={this.handleVisible}
        />
      </div>
    );
  }
}
