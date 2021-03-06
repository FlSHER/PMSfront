import React from 'react';
import style from './index.less';

class CheckBox extends React.Component {
  render() {
    const {
      option,
      checkStatus,
      value,
      nameKey,
      readonly,
      itemStyle = {},
    } = this.props;
    let options = [...option];
    // 判断一下option里是字符串还是对象
    if (options.length && options[0].constructor === String) {
      // 是字符串
      options = option.map((item) => {
        return {
          name: item,
          value: item,
        };
      });
    }
    return (
      <div className={style.check_status}>
        {options.map((item, i) => {
                    const checked = (value || []).indexOf(item.value) !== -1;
                    return (
                      <div
                        key={item.value}
                        className={[style.s_item, checked ? style.active : null].join(' ')}
                        style={{ display: readonly && !checked ? 'none' : '', ...itemStyle }}
                        onClick={() => (checkStatus ? checkStatus(i, item.value, nameKey) : null)}
                      >
                        {item.name}
                      </div>
                    );
                })
                }
      </div>
    );
  }
}
CheckBox.propTypes = {};

export default CheckBox;
