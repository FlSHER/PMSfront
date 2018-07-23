
const menuData = [
  {
    name: '奖扣',
    path: 'reward',
    children: [
      {
        name: '记录奖扣',
        path: 'buckle',
      },
      {
        name: '我的奖扣',
        path: 'my',
      },
    ],
  },
  {
    name: '审核',
    path: 'check',
    children: [
      {
        name: '奖扣审核',
        path: 'audit',
      },
      {
        name: '抄送我的',
        path: 'my-peruser',
      },
    ],
  },
  {
    name: '积分',
    path: 'point',
  },
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
