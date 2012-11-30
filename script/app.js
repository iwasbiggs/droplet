SP.App = function spApp() {
  var self;
  var engineTimeWindow = 10;

  var coreApi = {
    queue: function(action) {
    /*
      return SP.Platform.setTimeout(function() {
        action();
      }, 0);
      */
      return webkitRequestAnimationFrame(function() {
        action();
      });
    },
    log: SP.Platform.log,
    now: SP.Platform.now
  };

  var canvas = SP.Platform.getById('primary_sapling_canvas');
  var engine = SP.Engine(coreApi, engineTimeWindow);

  var extensionApi = {
    addAction: engine.addAction,
    log: SP.Platform.log
  };

  var renderContext = SP.Context(extensionApi, canvas);

  var moduleApi = {
    addAction: engine.addAction,
    renderDrop: renderContext.renderDrop,
    clear: renderContext.clear,
    log: SP.Platform.log,
    now: SP.Platform.now
  };

  self = {
    main: function() {
      var render = SP.Renderer(extensionApi);
      /*
      var ratio = canvas.getContext('2d').webkitBackingStorePixelRatio || 1;
      var scale = 1 / ratio;
      if (ratio !== 1) {
        canvas.width = scale * canvas.width;
        canvas.height = scale * canvas.height;
        canvas.style.width = '640px';
        canvas.style.height = '480px';
        canvas.getContext('2d').scale(scale, scale);
      }
      */
      var sapling = SP.Sapling(moduleApi, canvas);

      SP.Platform.addListener(
          canvas, 'mousedown', function canvasClicked(event) {
            sapling.addDrop(event.offsetX, event.offsetY);
          });
      
      return self;
    }
  };
  return self;
};
