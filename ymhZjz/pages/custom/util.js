/* utils/util.js */

/* 函数防抖 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    const context = this; // 保存 this 上下文
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args); // 使用 apply 确保正确的 this 并传递参数
    }, delay);
  };
}

/* 函数节流 */
function throttle(fn, interval = 300) {
  let lastTime = 0;
  return function (...args) {
    const context = this; // 保存 this 上下文
    const now = Date.now();
    if (now - lastTime >= interval) {
      fn.apply(context, args); // 使用 apply 确保正确的 this 并传递参数
      lastTime = now;
    }
  };
}

export default {
  debounce,
  throttle
};
