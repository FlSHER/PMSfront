export function renderList (list, callback, config) {
  let arr = [];
  (list || []).forEach((i, k) => {
      if (callback) {
          arr.push(callback(i, k))
      }
  })

  if (config && config.head) {
      arr.unshift(config.head)
  }
  if (config && config.tail) {
      arr.push (config.tail)
  }
  return arr
}

export function getQueryString (query, name) {
  let search = '';
  (query || window.location.search).slice(1).split('&').map(i => i = i.split('=')).map(i => {
      if (i[0] == name) {
          search = i[1]
      }
      return i
  })
  return search
}
