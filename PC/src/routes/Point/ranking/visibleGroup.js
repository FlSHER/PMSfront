import React from 'react';
import { Progress, TreeSelect } from 'antd';

import OATable from '../../../components/OATable';
import styles from './index.less';

const dataSource = [{
  rangking: '1',
  realname: '胡彦斌',
  point: 102,
}, {
  rangking: '2',
  realname: '胡彦祖',
  point: 42,
}];

const columns = [{
  title: '排名',
  width: 90,
  dataIndex: 'rangking',
}, {
  title: '姓名',
  width: 150,
  dataIndex: 'realname',
  searcher: true,
}, {
  title: '积分',
  dataIndex: 'point',
  sorter: true,
  width: 370,
  render(point) {
    const percent = (point / 102).toFixed(2) * 100;
    return (
      <React.Fragment>
        {point}
        <span style={{ display: 'inline-block', width: '300px', float: 'right' }}>
          <Progress
            percent={percent}
            strokeColor="#59c3c3"
            showInfo={false}
          />
        </span>
      </React.Fragment>
    );
  },
}, {
  title: '操作',
  width: 90,
  render() {
    return (
      <React.Fragment>
        <a style={{ color: '#59c3c3' }}>查看</a>
      </React.Fragment>
    );
  },
}];
const { TreeNode } = TreeSelect;

export default class extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.myRangking}>
          <span style={{ marginRight: 10 }}>选择部门</span>
          <TreeSelect
            showSearch
            style={{ width: 150, color: '#59c3c3' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
          >
            <TreeNode value="parent 1" title="parent 1" key="0-1">
              <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                <TreeNode value="leaf1" title="my leaf" key="random" />
                <TreeNode value="leaf2" title="your leaf" key="random1" />
              </TreeNode>
              <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
              </TreeNode>
            </TreeNode>
          </TreeSelect>
        </div>
        <OATable
          columns={columns}
          dataSource={dataSource}
          operatorVisble={false}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
    );
  }
}
