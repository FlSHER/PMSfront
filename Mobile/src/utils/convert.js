
// 银行类型
// 中国农业银行,中国工商银行,中国建设银行,中国银行,交通银行,招商银行,中国邮政储蓄银行,农村商业银行

// import stastic from '../assets/stastic.svg';
// import stastic_ from '../assets/stastic_.svg';

import home from '../assets/home.svg';
import home_ from '../assets/home_.svg';

// import my from '../assets/my.svg';
// import my_ from '../assets/my_.svg';

import appro from '../assets/appro.svg';
import appro_ from '../assets/appro_.svg';

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
  to: '/audit_list',
  icon: appro_,
  selIcon: appro,
},
// {
//   title: '统计',
//   key: 'statistics',
//   to: '/statistics',
//   icon: stastic_,
//   selIcon: stastic,
// },
// {
//   title: '我的',
//   key: 'my',
//   to: '/my',
//   icon: my_,
//   selIcon: my,
// }
];


// 首页入口
export const indexMenu = [
  // {
  //   name: '任务中心',
  //   key: '1',
  //   children: [
  //     { text: '当前任务', to: '', icon: import('../assets/jobstation/积分制-icon-当前任务.png') },
  //     { text: '任务审核', to: '', icon: import('../assets/jobstation/积分制-icon-任务管理.png') },
  //     { text: '任务管理', to: '', icon: import('../assets/jobstation/积分制-icon-任务管理.png') },
  //     { text: '任务统计', to: '', icon: import('../assets/jobstation/积分制-icon-任务统计.png') },
  //     { text: '特殊任务', to: '', icon: import('../assets/jobstation/积分制-icon-特殊任务.png') },
  //     { text: '周期任务', to: '', icon: import('../assets/jobstation/积分制-icon-周期任务.png') },
  //     { text: '悬赏任务', to: '', icon: import('../assets/jobstation/积分制-icon-悬赏任务.png') },
  //   ],
  // },
  {
    name: '奖扣',
    key: '2',
    children: [
      { text: '记录奖扣', to: '/buckle_preview', icon: import('../assets/jobstation/积分制-icon-记录奖扣.png') },
      { text: '奖扣审核', to: '/audit_list', icon: import('../assets/jobstation/积分制-icon-奖扣审核.png') },
      { text: '我的奖扣', to: '/buckle_list', icon: import('../assets/jobstation/积分制-icon-我的奖扣.png') },
    ],
  },
  {
    name: '积分',
    key: '3',
    children: [
      { text: '我的积分', to: '/point_statistic', icon: import('../assets/jobstation/积分制-icon-我的积分.png') },
      { text: '积分明细', to: '/point_list', icon: import('../assets/jobstation/积分制-icon-投诉受理.png') },
      // { text: '全员统计', to: '', icon: import('../assets/jobstation/积分制-icon-全员统计.png') },
      { text: '积分排名', to: '/ranking_group', icon: import('../assets/jobstation/积分制-icon-积分排名.png') },
      { text: '奖扣指标', to: '/buckle_target', icon: import('../assets/jobstation/积分制-icon-我的奖扣.png') },

      // { text: '投诉受理', to: '', icon: import('../assets/jobstation/积分制-icon-投诉受理.png') },
    ],
  },
];

export const buckleState = (state) => {
  switch (state) {
    case 0:
      return '审核中';
    case 1:
      return '审核中';
    case 2:
      return '已通过';
    case -1:
      return '已驳回';
    case -2:
      return '已撤回';
    case -3:
      return '已撤销';
    default:
  }
};
// 待审核的列表需要操作的状态
export const auditState = (state) => {
  switch (state) {
    case 0:
      return '初审';
    case 1:
      return '终审';
    default:
  }
};
// 待审核的列表需要操作的标签颜色
export const auditLabel = (state) => {
  switch (state) {
    case 0:
      return 'label_state_first';
    case 1:
      return 'label_state_final';
    default:
  }
};
// 状态标签颜色
export const convertStyle = (status) => {
  switch (status) {
    case -3: return 'label_state_0';
    case -2: return 'label_state_0';
    case -1: return 'label_state_1';
    case 0: return 'label_state_3';
    case 1:
    case 2: return 'label_state_2';
    default: return 'label_state_default';
  }
};
// 已审核的列表已操作的状态
export const auditFinishedState = (item) => {
  if (item.status_id === 1 || (item.first_approved_at && item.status_id === -1)) {
    return '初审';
  } else if (item.status_id === 2 || (item.status_id === -1 && !item.final_approved_at)) {
    return '终审';
  }
};

// 已审核的列表已操作的状态
export const auditFinishedLabel = (item) => {
  if (item.status_id === 1 || (item.first_approved_at && item.status_id === -1)) {
    return 'label_state_first';
  } else if (item.status_id === 2 || (item.status_id === -1 && !item.final_approved_at)) {
    return 'label_state_final';
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

export const pointSource = [
  {
    name: '基础', value: 0,
  },
  {
    name: '工作', value: 1,
  },
  {
    name: '行政', value: 2,
  },
  {
    name: '创新', value: 3,
  },
  {
    name: '其他', value: 4,
  },
];

export const convertPointSource = (id) => {
  switch (id) {
    case 0: return '基础';
    case 1: return '工作';
    case 2: return '行政';
    case 3: return '创新';
    case 4: return '其他';
    default:
  }
};

