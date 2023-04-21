import s from "./admin.style.module.css";

const render = {};

render.Admin = (vm) => (
  <div className={s.adminWrap}>
    <a href="/">Admin</a>
    {JSON.stringify(vm.state)}
    {render.AdminAction(vm)}
  </div>
);

render.AdminAction = (vm) => (
  <>
    <div onClick={vm.handleGet}>Get</div>
    <div onClick={vm.handleSet}>Set</div>
  </>
);

export default render;
