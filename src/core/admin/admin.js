import { useReducer } from "react";
import Render from "./admin.render";

const act = {
  GET: "GET",
  SET: "SET"
};

export const reducer = (state, action) => {
  switch (action.type) {
    case act.GET:
      return { ...state, status: true, count: state.count++ };
    case act.SET:
      return { ...state, status: false, count: state.count++ };
    default:
      return state;
  }
};

const WrapState = (hook) => {
  const [state, dispatch] = hook;
  return { state, dispatch };
};

function Admin() {
  const vm = WrapState(
    useReducer(reducer, {
      data: { name: "abc" },
      status: false,
      count: 0
    })
  );

  vm.handleSet = () => {
    vm.dispatch({ type: act.SET });
  };

  vm.handleGet = () => {
    vm.dispatch({ type: act.GET });
  };

  return Render.Admin(vm);
}

export default Admin;
