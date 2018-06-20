import React, { Component } from 'react';
import { SearchBar, Button, List } from 'antd-mobile';
import { PersonIcon } from '../../components/index.js';
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
    } = this.props;
    return (
      <div className={style.con}>
        <div className={style.header}>
          <SearchBar
            value={this.state.value}
            placeholder="Search"
            showCancelButton
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
          {this.state.value ? null : (
            <div className={style.bread}>
              <div className={style.bread_title}>
                {bread.map((item, i) => {
                const idx = i;
                if (i !== bread.length - 1) {
                  return (
                    <div
                      className={style.bread_item}
                      onClick={() => handleBread(item)}
                      key={idx}
                    >
                      <a>{item.name}
                      </a>
                      <span className={style.arrow}>{'>'}</span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={style.bread_item}
                      key={idx}
                    >
                      <span>{item.name}</span>
                    </div>
                  );
                }
              })}
              </div>

            </div>
)}
          { this.state.value ? null : (
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
