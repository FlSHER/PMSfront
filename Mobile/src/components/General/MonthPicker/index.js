import React from 'react';
import moment from 'moment';
import unlast from '../../../assets/select_icon/unlast.png';
import last from '../../../assets/select_icon/last.png';
import unnext from '../../../assets/select_icon/unnext.png';
import next from '../../../assets/select_icon/next.png';

import style from './index.less';

export default class MonthPicker extends React.Component {
  constructor(props) {
    const { value } = props;
    super(props);
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (JSON.stringify(value) !== JSON.stringify(this.props.value)) {
      this.setState({
        value,
      });
    }
  }


  handleOnChange = (step) => {
    const { value } = this.state;
    const { onChange } = this.props;
    const newValue = moment(value).subtract(step, 'months');
    this.setState({
      value: newValue,
    }, () => {
      onChange(moment(newValue).format('YYYY-MM'));
    });
  }

  render() {
    const { value } = this.state;
    const { range: { max, min } } = this.props;
    const renderValue = moment(value).format('YYYY-MM');

    const maxValue = max && moment(max).format('YYYY-MM');
    const minValue = min && moment(min).format('YYYY-MM');

    const nextDisabled = renderValue === maxValue;
    const lastDisabled = renderValue === minValue;

    const nextoptStyle = [style.opt, nextDisabled ? style.disabled : null].join(' ');
    const lastoptStyle = [style.opt, lastDisabled ? style.disabled : null].join(' ');

    return (
      <div className={style.picker}>
        <span
          className={lastoptStyle}
          onClick={lastDisabled ? null : () => this.handleOnChange(1)}
        >
          <img src={lastDisabled ? unlast : last} alt="last" />
        </span>
        <span className={style.time}>{renderValue}</span>
        <span
          className={nextoptStyle}
          onClick={nextDisabled ? null : () => this.handleOnChange(-1)}
        >
          <img src={nextDisabled ? unnext : next} alt="next" />
        </span>
      </div>
    );
  }
}

MonthPicker.defaultProps = {
  value: new Date(),
  range: { max: new Date(), min: null },
  onChange: () => {},
};

