import React from 'react';
import { ListSort } from '../../components/index';
import style from './index.less';

class ModalSorter extends React.PureComponent {
  render() {
    const { onChange, data, visible, onCancel } = this.props;
    return (
      <div className={style.filter_con}>
        <ListSort
          contentStyle={{
            position: 'fixed',
            zIndex: 99,
            left: 0,
            top: '1.17333rem',
            bottom: 0,
            right: 0,
            overflow: 'auto',
            background: 'rgba(0, 0, 0, 0.1)',
          }}
          visible={visible}
          onCancel={onCancel}
          filterKey="sortModal"
        >
          {data.map((item, i) => {
            const idx = i;
            return (
              <div
                className={style.sort_item}
                key={idx}
                onClick={() => { onChange(item.value); }}
              >{item.name}
              </div>
            );
          })}
        </ListSort>
      </div>
    );
  }
}
ModalSorter.defaultProps = {
  data: [],
  visible: false,
  onChange: () => { },
};
export default ModalSorter;
