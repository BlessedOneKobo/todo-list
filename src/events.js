const eventList = [];

export function on(name, handler) {
  const idx = eventList.findIndex(et => et.name === name);

  if (idx === -1) {
    eventList.push({ name, handlerList: [handler] });
    return;
  }

  eventList[idx].handlerList.push(handler);
}

export function emit(name, ...args) {
  const event = eventList.find(et => et.name === name);

  if (!event) {
    return;
  }

  event.handlerList.forEach(handler => {
    handler(...args);
  });
}

export function remove(name) {
  const idx = eventList.findIndex(et => et.name === name);

  if (idx === -1) {
    return;
  }

  eventList.splice(idx, 1);
}
