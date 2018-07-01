import React, { Component } from 'react';
import { Button, List } from 'antd-mobile';
import { PersonIcon } from '../../components/index.js';
import { Search, Bread } from '../../components/General/index';
import style from './index.less';

export default class SearchList extends Component {
  state = {
    value: '',
  };

  onChange = (value) => {
    this.setState({ value });
  };
  onSubmit = () => {
    const { handleSearch } = this.props;
    handleSearch(this.state.value);
  }
  onCancel = () => {
    const { handleBread, bread } = this.props;
    this.setState({
      value: '',
    }, () => {
      if (bread && bread.length) {
        handleBread(bread[bread.length - 1]);
      }
    });
  }
  render() {
    const {
      bread,
      children,
      multiple,
      name,
      selected,
      checkedAll,
      checkAble,
      handleBread,
      firstDepartment,
      selectOk,
      isFinal = false,
    } = this.props;
    return (
      <div className={style.con}>
        <div className={style.header}>
          {isFinal ? null : (
            <Search
              value={this.state.value}
              placeholder="请输入员工姓名"
              showCancelButton={this.state.value}
              onChange={this.onChange}
              onCancel={
            this.state.value ? this.onCancel :
            () => {}
          }
              onSubmit={this.onSubmit}
            />
)}

          {this.state.value ? null : (
            <Bread
              bread={bread}
              handleBread={handleBread}
            />
)}
          { this.state.value || isFinal ? null : (
            <div style={{ padding: '0 0.32rem' }} >
              <List >
                <List.Item
                  arrow="horizontal"
                  onClick={firstDepartment}
                >全部
                </List.Item>
              </List>
            </div>
) }

          {multiple && !this.state.value ? (
            <div className={style.action}>
              <div className={style.action_item}>
                <div
                  className={[style.item, checkAble ? style.checked : null].join(' ')}
                  onClick={checkedAll}
                >
                  <span>全选</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className={style.con_content}>
          {children}
        </div>
        {
          multiple ? (
            <div className={style.footer}>
              <div className={style.sel_result}>
                <div className={style.person_list}>
                  {selected.data.map((item, i) => {
                    const idx = i;
                    return (
                      <PersonIcon
                        key={idx}
                        value={item}
                        nameKey={name}
                        showNum={2}
                        itemStyle={{ marginBottom: 0 }}
                        footer={false}
                      />
                    );
                  })}
                </div>
                <div className={style.opt}>
                  <Button
                    size="small"
                    type={selected.num > selected.total ? 'dashed' : 'primary'}
                    disabled={selected.num > selected.total}
                    onClick={selectOk}
                  >
                    {selected.num}/{selected.total}确认
                  </Button>
                </div>
              </div>
            </div>
          ) : null
        }

      </div>
    );
  }
}

SearchList.defaultProps = {
  multiple: false,
  name: 'name',
  checkAble: false,
};
