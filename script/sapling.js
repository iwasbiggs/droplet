SP.Animate = function spAnimate(startTime, duration) {
  var current = startTime;
  var progress = 0;
  var self;

  self = {
    update: function animateUpdate(now) {
      progress = (now - startTime) / duration;
      if (progress < 0) {
        progress = 0;
      } else if (progress > 1) {
        progress = 1;
      }
      return self;
    },
    getProgress: function animateGetProgress() {
      return progress;
    },
    getDuration: function animateGetDuration() {
      return duration;
    }
  };
  return self;
};

SP.Drop = function spDrop(x, y, colors) {
  var self;
  var width = 100;
  var height = 100;
  var duration = 3000;
  var fade;

  self = {
    update: function dropUpdate(now) {
      if (!fade) {
        fade = SP.Animate(now, duration);
      } else {
        fade.update(now);
      }
      return self;
    },
    x: x,
    y: y,
    width: width,
    height: height,
    colors: colors,
    getOpacity: function dropGetOpacity() {
      return 1 - self.getProgress();
    },
    getProgress: function dropGetProgress() {
      return fade && fade.getProgress() || 0;
    }
  };
  return self;
};

SP.Sapling = function spSapling(api) {
  var self;
  var fade;
  var framesRendered;
  var drops = [];

  function dropUpdate() {
    var now = api.now();

    api.clear();

    drops = drops.filter(function(drop) {
      return drop.update(now).getProgress() !== 1;
    });

    drops.forEach(function(drop) {
      api.renderDrop(drop);
    });

    if (drops.length) {
      api.addAction(dropUpdate);
    }
  }

  function normalizeSin(percent) {
    return (Math.sin(Math.PI * 2 * percent) + 1) / 2;
  }

  function generateColor() {
    var seconds = (new Date()).getSeconds();
    var red = Math.round(normalizeSin((seconds % 10) / 10) * 64);
    var green = Math.round(normalizeSin((seconds % 20) / 20) * 128);
    var blue = Math.round(normalizeSin((seconds % 30) / 30) * 255);
    return [red, green, blue];
  }

  self = {
    addDrop: function saplingAddDrop(x, y) {
      if (!drops.length) {
        api.addAction(dropUpdate);
      }
      drops.push(SP.Drop(x, y, generateColor()));
      return self;
    }
  };
  return self;
};
