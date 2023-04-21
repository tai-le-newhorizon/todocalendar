import Render from "./site.render";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Site() {
  let navigate = useNavigate();

  const vm = {};
  vm.handleGoToAdminClick = () => {
    navigate("/admin");
  };

  useEffect(() => {});

  return Render.Homepage(vm);
}

export default Site;
