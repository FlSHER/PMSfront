
// 银行类型
// 中国农业银行,中国工商银行,中国建设银行,中国银行,交通银行,招商银行,中国邮政储蓄银行,农村商业银行

import stastic from '../assets/stastic.svg';
import stastic_ from '../assets/stastic_.svg';

import home from '../assets/home.svg';
import home_ from '../assets/home_.svg';

import my from '../assets/my.svg';
import my_ from '../assets/my_.svg';

import appro from '../assets/appro.svg';
import appro_ from '../assets/appro_.svg';

import list from '../assets/list.svg';
import more from '../assets/more.svg';
import application from '../assets/application.svg';

export const bankType = [
  { value: '1', label: '中国工商银行' },
  { value: '2', label: '中国农业银行' },
  { value: '3', label: '中国建设银行' },
  { value: '4', label: '中国银行' },
  { value: '5', label: '交通银行' },
  { value: '6', label: '招商银行' },
  { value: '7', label: '中国邮政储蓄银行' },
  { value: '8', label: '农村商业银行' },
];
// 底部菜单
export const tabbar = [{
  title: '申请',
  key: '',
  to: '/home',
  icon: home_,
  selIcon: home,
}, {
  title: '审批',
  key: 'approval',
  to: '/approvelist',
  icon: appro_,
  selIcon: appro,
}, {
  title: '统计',
  key: 'statistics',
  to: '/statistics',
  icon: stastic_,
  selIcon: stastic,
}, {
  title: '我的',
  key: 'my',
  to: '/my',
  icon: my_,
  selIcon: my,
}];


// 首页入口
export const indexMenu = [{
  src: application,
  title: '申请',
  to: '/add_reimbur',
}, {
  src: list,
  title: '报销单',
  to: '/my_reimbur',
}, {
  src: more,
  title: '其他',
  to: '/add_reimbur',
}];
// 报销单状态
export const startState = [
  { title: '全部', type: 'all' },
  { title: '已完成', type: 'finished' },
  { title: '处理中', type: 'processing' },
  { title: '被驳回', type: 'rejected' },
  { title: '撤回', type: 'withdraw' },
];


export const approvalState = [
  { title: '全部', type: 'all' },
  { title: '待审批', type: 'processing' },
  { title: '已通过', type: 'approved' },
  { title: '已转交', type: 'deliver' },
  { title: '已驳回', type: 'rejected' },
];

export const reverseState = (state) => {
  switch (state) {
    case 1:
      return '未提交';
    case 2:
      return '处理中';
    case 3:
      return '已完成';
    case 4:
      return '已驳回';
    default:
      return '其他';
  }
};

export function clearString(s) {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
  let rs = '';
  for (let i = 0; i < s.length; i += 1) {
    rs += s.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

export function dealThumbImg(url, str) {
  const i = url.lastIndexOf('.');
  const newImg = url.slice(0, i) + str + url.slice(i);
  return newImg;
}
export function reAgainImg(url, str) {
  const i = url.lastIndexOf(str);
  const newImg = url.slice(0, i) + url.slice(i + str.length);
  return newImg;
}
