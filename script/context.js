
SP.Context = function spContext(api, canvas) {
  var width = canvas.width = canvas.clientWidth;
  var height = canvas.height = canvas.clientHeight;
  var context = canvas.getContext('2d');
  var self;

  function buildFillStyle(channelValues) {
    return 'rgb(' + channelValues.join() + ')';
  }

  function renderDrop(drop) {
    context.save();
    context.translate(drop.x, drop.y);
    context.fillStyle = buildFillStyle(drop.colors);
    context.globalAlpha = drop.getOpacity();
    context.scale(drop.getProgress(), drop.getProgress());
    context.fillRect(-drop.width/2, -drop.height/2, drop.width, drop.height);
    context.restore();
    return self;
  }

  self = {
    renderDrop: renderDrop,
    clear: function contextClear() {
      context.clearRect(0, 0, width, height);
      return self;
    },
    resize: function contextResize() {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    },
    getWidth: function contextGetWidth() {
      return width;
    },
    getHeight: function contextGetHeight() {
      return height;
    }
  };
  return self;
};
