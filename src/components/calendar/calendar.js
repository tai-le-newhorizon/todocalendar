import React from "react";
import { findDOMNode } from "react-dom";

import s from "./calendar.style.module.css";

let $ = window.$
function Calendar() {
  let vm = {}
  vm.domRef = React.createRef()
  React.useEffect(() => {
    const el = findDOMNode(vm.domRef)
    $(el).TodoCalendar()
  })

  return <div className={s.calendar_wrap}>
    <div ref={vm.domRef}></div>
  </div>
}

export default Calendar