import React, { Component } from 'react';
import {
  connect,
} from 'dva';
import { SearchBar, Button } from 'antd-mobile';
import style from './index.less';

class SearchList extends Component {
  state = {
    value: '美食',
  };
  onChange = (value) => {
    const { handleSearch } = this.props;
    this.setState({ value }, () => {
      handleSearch(value);
    });
  };

  render() {
    const { bread, children, multiple, selected, checkedAll, count, handleBread } = this.props;
    return (
      <div className={style.con}>
        <div className={style.header}>
          <SearchBar
            value={this.state.value}
            placeholder="Search"
            showCancelButton
            onChange={this.onChange}
          />
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
                      <span className={style.arrow}>to</span>
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
          {multiple ? (
            <div className={style.action}>
              <div className={style.action_item}>
                <div
                  className={[style.item, selected.num === count ? style.checked : null].join(' ')}
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
                  {selected.data.map((its, i) => {
                    const idx = i;
                    return (
                      <div
                        key={idx}
                        className={style.person_item}
                      >魏颖
                      </div>
                    );
                  })}
                </div>
                <div className={style.opt}>
                  <Button
                    size="small"
                    type={selected.num > selected.total ? 'dashed' : 'primary'}
                    disabled={selected.num > selected.total}
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
};

export default connect()(SearchList);
