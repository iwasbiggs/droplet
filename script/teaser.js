SP.Teaser = function(api, width, height) {
  var self;
  var timeoutId = api.setTimeout(timeoutFired, generateDelay());
  var callLater = function() {};

  function timeoutFired() {
    timeoutId = api.setTimeout(timeoutFired, generateDelay());
    callLater(
      Math.round(Math.random() * width),
      Math.round(Math.random() * height));
  }

  function generateDelay() {
    return Math.round((Math.random() * 6000) + 1000);
  }

  self = {
    pause: function teaserPause() {
      api.clearTimeout(timeoutId);
      timeoutId = api.setTimeout(timeoutFired, 8000);
      return self;
    },
    onPoke: function teaserOnPoke(callback) {
      callLater = callback;
      return self;
    }
  };
  return self;
};
