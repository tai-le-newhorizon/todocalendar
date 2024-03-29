import R from "react";
import { useForm } from "react-hook-form";

import S from "./calendar.style.module.css";
import initHandlers from "./calendar.handlers";

function Calendar() {
  let vm = {
    domRef: R.createRef(),
    form: useForm({
      defaultValues: {
        title: "Happystep",
        extendedProps: {
          status: "doing",
          tags: "code",
          projects: "personal",
        },
        eventRaw: {},
      },
    }),
  };

  initHandlers(vm);
  R.useEffect(vm.useEffect);

  return (
    <div>
      {vm.watchEventRaw?.id && <div className={S.form_wrap} onClick={vm.handleCancelClick}>
        <form
          className={S.form}
          onSubmit={vm.form.handleSubmit(vm.handleSubmit)}
          onClick={(e) => { e.stopPropagation() }}
        >
          <div>
            <input {...vm.form.register("title")} />
          </div>
          <div>
            <select {...vm.form.register("extendedProps.status")}>
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </div>
          <div>
            <input {...vm.form.register("extendedProps.tags")} />
          </div>
          <div>
            <input {...vm.form.register("extendedProps.projects")} />
          </div>
          <div className={S.form_btns}>
            <input className={S.btn_submit} type="submit" />
            <div className={S.btn_cancel} onClick={vm.handleCancelClick}>
              Cancel
            </div>
            <div className={S.btn_delete} onClick={vm.handleDeleteClick}>
              Delete
            </div>
          </div>
        </form>
      </div>}
      <div className={S.calendar_wrap}>
        <div>
          <div className={S.filter_label}>Tags</div>
          <div className={S.filters}>
            <span onClick={() => vm.handleFilterClick()}>all</span>
            <span onClick={() => vm.handleFilterClick("tags", "dev")}>dev</span>
            <span onClick={() => vm.handleFilterClick("tags", "code")}>code</span>
            <span onClick={() => vm.handleFilterClick("tags", "c++")}>c++</span>
          </div>
          <div className={S.filter_label}>Status</div>
          <div className={S.filters}>
            <span onClick={() => vm.handleFilterClick()}>all</span>
            <span onClick={() => vm.handleFilterClick("status", "todo")}>todo</span>
            <span onClick={() => vm.handleFilterClick("status", "doing")}>doing</span>
            <span onClick={() => vm.handleFilterClick("status", "done")}>done</span>
          </div>
        </div>
        <div id="abc" ref={vm.domRef}></div>
      </div>
    </div>
  );
}

export default Calendar;
