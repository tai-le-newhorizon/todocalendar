import "./todo.calendar.css";
import todoModel from "./todo.model.indexedDB";

(function ($) {
  let TodoCalendar = function (action = "init", options = {}) {
    let ele = this.get(0);
    if (!ele) {
      return;
    }

    options.eventChange = options.eventChange || function () {};
    let settings = $.extend(
      {
        view: "dayGridMonth",
        headerToolbar: {
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        views: {
          timeGridWeek: { pointer: true },
          resourceTimeGridWeek: { pointer: true },
        },
        firstDay: 1,
        dayMaxEvents: false,
        nowIndicator: true,
        selectable: true,
        eventStartEditable: true,
        eventContent: (info) => renderEventContent(info),
      },
      options
    );

    ele.init = function () {
      todoModel.findAll((events) => {
        ele.calendar = renderCalendar(ele, settings, events);
        ele.calendar.setOption("events", events);
      });
    };

    ele.filter = function (index, value) {
      let searchValue = null;
      ztry(() => {
        searchValue = IDBKeyRange.only(value);
      });
      todoModel.findAll(
        (events) => {
          ele.calendar.setOption("events", events);
        },
        index,
        searchValue
      );
    };

    switch (action) {
      case "init":
        ele.init();
        break;
      case "filter":
        ele.filter("tags", "code");
        break;
      default:
    }

    return ele;
  };

  $.fn.TodoCalendar = TodoCalendar;

  let renderCalendar = (ele, settings, events) => {
    ele.innerHTML = "";
    let calendar = new window.EventCalendar(
      ele,
      $.extend({ events: [] }, settings)
    );
    return calendar;
  };

  let renderEventContent = (info) => {
    if (!!info.event.titleHtml) {
      return { html: info.event.titleHtml };
    }

    let projects = info.event.extendedProps.projects;
    let tags = info.event.extendedProps.tags;

    let htmlStatus = !!info.event.extendedProps.status
      ? `<span class="task_status ${info.event.extendedProps.status}">${info.event.extendedProps.status}</span>`
      : "";
    let htmlProjects =
      projects && projects.length > 0
        ? `<span class="task_projects ${projects}">
            ${projects.join?.(" ")}
          </span>`
        : "";
    let htmlTags =
      tags && tags.length > 0
        ? `<span class="task_tags ${tags}">
            ${tags.join?.(" ")}
          </span>`
        : "";
    let html = `<div class="task">
      <div class="task_title">${info.event.title}</div>
      <div>${htmlStatus} ${htmlProjects} ${htmlTags}</div>
    </div>`;
    return { html };
  };
})(window.$);
