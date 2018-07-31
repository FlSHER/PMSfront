import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';
import ModalFilters from '../components/ModalFilters';
import { doConditionValue, getUrlString } from '../utils/util';

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
    this.filters = doConditionValue(this.urlFilersParams);
    this.sorts = doConditionValue(this.urlSortParams);
  }

  handleVisible = (flag, model) => {
    this.setState({ visible: !!flag, model });
  }

  render() {
    return (
      <div>
        {auditStates.map((item) => {
          return (
            <button
              key={item.name}
              // onClick={() => this.tabChange(item.value)}
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
          onCancel={this.handleVisible}
        />
      </div>
    );
  }
}
