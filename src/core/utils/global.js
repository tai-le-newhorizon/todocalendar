import "./todo.calendar.plugin";

window.ztry = function (f, callback = () => {}) {
  try {
    f.apply(this, arguments);
  } catch (e) {
    callback(e)
  }
};

window.zlog = function (...args) {
  // zlog(...args)
}