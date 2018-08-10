
const menuData = [
  {
    name: '奖扣',
    path: 'reward',
    children: [
      {
        name: '记录奖扣',
        path: 'insert-record',
      },
      {
        name: '批量奖扣',
        path: 'buckle',
        children: [
          {
            name: '提交成功',
            path: 'success/:id',
            hiddenMenu: true,
          },
          {
            name: '再次提交',
            path: 'submission/:id',
            hiddenMenu: true,
          },
        ],
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
    ],
  },
  {
    name: '积分',
    path: 'point',
    children: [
      {
        name: '我的积分',
        path: 'my',
      },
      {
        name: '积分明细',
        path: 'detail',
      },
      {
        name: '积分排名',
        path: 'ranking',
      },
    ],
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
