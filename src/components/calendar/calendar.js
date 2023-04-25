import R from "react";
import { useForm } from "react-hook-form";

import todoModel from "./../../core/utils/todo.model.indexedDB";
import S from "./calendar.style.module.css";

const defaultTitle = ""

let $ = window.$;
function Calendar() {
  let vm = {
    domRef: R.createRef(),
    form: useForm({
      defaultValues: {
        title: defaultTitle,
        tags: ["code", "c++", "dev"],
        projects: ["NTC", "NHZ"],
        extendedProps: {
          status: "todo",
          tags: [],
          projects: [],
        },
        eventRaw: {},
      },
    }),
  };

  initHandlers(vm);
  R.useEffect(vm.useEffect);

  return (
    <div className={S.calendar_wrap}>
      <form className={S.form} onSubmit={vm.form.handleSubmit(vm.handleSubmit)}>
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
      <div>
        <div>Filters</div>
        <div className={S.filters}>
          <span onClick={() => vm.handleFilterClick()}>all</span>
          <span onClick={() => vm.handleFilterClick("dev")}>dev</span>
          <span onClick={() => vm.handleFilterClick("code")}>code</span>
          <span onClick={() => vm.handleFilterClick("c++")}>c++</span>
        </div>
      </div>
      <div id="abc" ref={vm.domRef}></div>
    </div>
  );
}

function initHandlers(vm) {
  let updateEvent = (info) => {
    let event = info.event;
    event.id = parseInt(event.id);
    todoModel.up(event);
  };

  vm.useEffect = () => {
    vm.calendarEle = $(vm.domRef.current).TodoCalendar("init", {
      eventResize: updateEvent,
      eventDrop: updateEvent,
      dateClick: (info) => {
        let event = {
          start: info.dateStr,
          end: info.dateStr,
          title: defaultTitle,
          allDay: true,
          extendedProps: {
            status: "todo",
            tags: ["dev", "code", "c++"],
            projects: ["nhz", "personal"],
          },
        };
        todoModel.add(event, (eventId) => {
          event.id = eventId;
          vm.calendarEle.calendar.addEvent(event);

          // Set form
          vm.form.reset();
          vm.form.setValue("title", event.title);
          vm.form.setValue("extendedProps", event.extendedProps);
          vm.form.setValue("eventRaw", event);
        });
      },
      eventClick: (info) => {
        let event = info.event;
        vm.form.setValue("title", event.title);
        vm.form.setValue("extendedProps", event.extendedProps);
        vm.form.setValue("eventRaw", event);
      },
    });
  };

  vm.handleSubmit = (data) => {
    let formEvent = vm.form.getValues();
    let curEvent = formEvent.eventRaw;
    curEvent.title = formEvent.title;
    curEvent.extendedProps = formEvent.extendedProps;
    vm.calendarEle.calendar.updateEvent(curEvent);
    curEvent.id = parseInt(curEvent.id);
    todoModel.up(curEvent);
  };

  vm.handleFilterClick = (tagName) => {
    vm.calendarEle.filter("tags", tagName);
    zlog(vm.calendarEle.calendar.getEvents());
  };

  vm.handleDeleteClick = () => {
    let formEvent = vm.form.getValues();
    let curEvent = formEvent.eventRaw;
    vm.calendarEle.calendar.removeEventById(curEvent.id);
    todoModel.del(parseInt(curEvent.id));
  };

  vm.handleCancelClick = () => {
    vm.form.reset();
  };
}

export default Calendar;
