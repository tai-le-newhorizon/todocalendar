import todoModel from "./../../core/utils/todo.model.indexedDB";

let $ = window.$;

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
          title: "",
          start: info.dateStr,
          end: info.dateStr,
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

export default initHandlers