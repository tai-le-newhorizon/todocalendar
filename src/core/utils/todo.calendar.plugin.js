import todoModel from "./todo.model.indexedDB.js";

let $ = window.$;
$.fn.TodoCalendar = function () {
  let ele = this;
  todoModel.findAll(
    (events) => {
      renderCalendar(ele, events);
    },
    "tags",
    IDBKeyRange.only("code")
  );
  return ele;
};

let renderCalendar = (ele, events) => {
  console.log(events);
  ele.innerHTML = "";
  let calendar = new window.EventCalendar(ele, {
    view: "dayGridMonth",
    headerToolbar: {
      start: "prev,next today",
      center: "title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
    },
    events: events,
    views: {
      timeGridWeek: { pointer: true },
      resourceTimeGridWeek: { pointer: true }
    },
    dayMaxEvents: false,
    nowIndicator: true,
    selectable: true,
    eventContent: (info) => renderEventContent(info)
  });
  return calendar
};

let renderEventContent = (info) => {
  if (!!info.event.titleHtml) {
    return { html: info.event.titleHtml };
  }

  let htmlStatus = !!info.event.extendedProps.status
    ? `<span class="task_status ${info.event.extendedProps.status}">${
        info.event.extendedProps.status || ""
      }</span>`
    : "";
  let htmlProjects = !!info.event.extendedProps.projects
    ? `<span class="task_projects ${info.event.extendedProps.projects}">${
        info.event.extendedProps.projects.join(" ") || ""
      }</span>`
    : "";
  let htmlTags = !!info.event.extendedProps.tags
    ? `<span class="task_tags ${info.event.extendedProps.tags}">${
        info.event.extendedProps.tags.join(" ") || ""
      }</span>`
    : "";
  let html = `<div class="task">
    <div class="task_title">${info.event.title}</div>
    <div>
      ${htmlStatus} ${htmlProjects}
      <div>${htmlTags}</div>
    </div>
  </div>`;
  return { html };
};
