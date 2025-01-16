class EventEmmiter {
  constructor() {
    this.events = new Map();
  }
  on(eventName, listener) {
    if (!this.events.has(eventName)) this.events.set(eventName, []);

    this.events.get(eventName).push(listener);
  }

  emit(eventName, ...args) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach((registeredListener) => {
        registeredListener(...args);
      });
    }
  }

  off(eventName, listener) {
    if (this.events.has(eventName)) {
      this.events.set(
        eventName,
        this.events
          .get(eventName)
          .filter((registeredListener) => registeredListener !== listener)
      );

      if (this.events.get(eventName).length === 0)
        this.events.delete(eventName);
    }
  }
}
