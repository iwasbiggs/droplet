SP.Platform = {
  getById: function platformGetById(id) {
    return document.getElementById(id);
  },
  setTimeout: function platformSetTimeout(callback, delay) {
    return setTimeout(callback, delay);
  },
  clearTimeout: function platformClearTimeout(id) {
    clearTimeout(id);
  },
  log: function platformLog(message) {
    window.console.log('log: ' + message);
  },
  now: function platformNow() {
    return Date.now();
  },
  addListener: function platformAddListener(element, eventName, callback) {
    element.addEventListener(eventName, function(event) {
      callback(event);
    });
  }
};
