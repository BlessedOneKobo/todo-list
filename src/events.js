const events = {};

export function on(name, handler) {
  events[name] = events[name] || [];
  events[name].push(handler);
}

export function emit(name, ...args) {
  const selectedEvent = events[name];

  if (!selectedEvent) {
    return;
  }

  selectedEvent.forEach(handler => handler(...args));
}

export function removeEvent(name) {
  delete events[name];
}

export function removeHandler(name, handler) {
  const selectedEvent = events[name];

  for (let idx = 0, len = selectedEvent.length; idx < len; idx += 1) {
    const selectedHandler = selectedEvent[idx];

    if (selectedHandler === handler) {
      selectedEvent.slice(idx, 1);
    }
  }
}
