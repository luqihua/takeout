export function formatDate(date, formatStr) {
  if (/(y+)/.test(formatStr)) {
    formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(formatStr)) {
      let str = o[k] + '';
      formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : appendZero(str));
    }
  }
  return formatStr;
};

function appendZero(str) {
  return ('00' + str).substr(str.length);
}
