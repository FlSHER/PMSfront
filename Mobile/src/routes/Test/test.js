import React from 'react';
// import { Button } from 'antd-mobile';
// import ModalFilters from '../components/ModalFilters';

export default class Nothing extends React.Component {
  // state = {
  //   visible: false,
  //   model: 'filter',
  // }

  // handleVisible = (flag, model) => {
  //   this.setState({ visible: !!flag, model });
  // }
  calDate= () => {
    const d1 = new Date();
    let m1 = d1.getMonth() === 0 ? 12 : d1.getMonth() + 1;
    let y1 = d1.getFullYear();
    const d2 = new Date('2017-9');
    let months;
    months = (d1.getFullYear() - d2.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    months = months <= 0 ? 0 : months;
    console.log(months);
    const arr = [];
    for (let i = 0; i <= months; i += 1) {
      const obj = {};
      obj.month = m1;
      obj.year = y1;
      m1 -= 1;
      if (m1 === 0) {
        m1 = 12;
        y1 -= 1;
      }
      arr.push(obj);
    }
    console.log(arr);
  }
  render() {
    return (
      <div>
        {this.calDate()}
      </div>
    );
  }
}
