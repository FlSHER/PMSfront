
const menuData = [
  {
    name: '任务',
    path: '/system/task',
  },
  {
    name: '奖扣',
    path: '/system/reward',
  },
  {
    name: '审核',
    path: '/system/check',
  },
  {
    name: '积分',
    path: '/system/point',
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
