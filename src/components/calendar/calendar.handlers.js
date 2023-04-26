import todoModel from "./../../core/utils/todo.model.indexedDB";

let $ = window.$;

function initHandlers(vm) {
  vm.watchEventRaw = vm.form.watch("eventRaw")
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
          title: "Happystep",
          start: info.dateStr,
          end: info.dateStr,
          allDay: true,
          extendedProps: {
            status: "todo",
            tags: ["code"],
            projects: ["personal"],
          },
        };
        todoModel.add(event, (eventId) => {
          event.id = eventId;
          vm.calendarEle.calendar.addEvent(event);

          // Cast data to form and set to form
          event.extendedProps.tags = event.extendedProps.tags?.join?.(',')
          event.extendedProps.projects = event.extendedProps.projects?.join?.(',')

          vm.form.reset();
          vm.form.setValue("title", event.title);
          vm.form.setValue("extendedProps", event.extendedProps);
          vm.form.setValue("eventRaw", event);
        });
      },
      eventClick: (info) => {
        let event = info.event;

        // Cast data to form
        event.extendedProps.tags = event.extendedProps.tags?.join?.(',')
        event.extendedProps.projects = event.extendedProps.projects?.join?.(',')

        vm.form.setValue("title", event.title);
        vm.form.setValue("extendedProps", event.extendedProps);
        vm.form.setValue("eventRaw", event);
      },
    });

    const subscription = vm.form.watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  };

  vm.handleSubmit = (data) => {
    let formEvent = vm.form.getValues();
    let curEvent = formEvent.eventRaw;

    // Modify value from form to calendar and data
    curEvent.title = formEvent.title;
    curEvent.extendedProps = formEvent.extendedProps;
    curEvent.extendedProps.tags = curEvent.extendedProps.tags ? curEvent.extendedProps.tags.split?.(',') : []
    curEvent.extendedProps.projects = curEvent.extendedProps.projects ? curEvent.extendedProps.projects?.split?.(',') : []

    vm.calendarEle.calendar.updateEvent(curEvent);

    curEvent.id = parseInt(curEvent.id);
    todoModel.up(curEvent);
    vm.form.reset();
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
    vm.form.reset();
  };

  vm.handleCancelClick = () => {
    vm.form.reset();
  };
}

export default initHandlers