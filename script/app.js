SP.App = function spApp() {
  var self;

  var coreApi = {
    queue: function(action) {
      //return SP.Platform.setTimeout(action);
      return webkitRequestAnimationFrame(action);
    },
    log: SP.Platform.log,
    now: SP.Platform.now
  };

  var canvas = SP.Platform.getById('primary_canvas');
  var engine = SP.Engine(coreApi, 10);

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
    now: SP.Platform.now,
    setTimeout: SP.Platform.setTimeout,
    clearTimeout: SP.Platform.clearTimeout
  };

  self = {
    main: function() {
      var render = SP.Renderer(extensionApi);
      var sapling = SP.Sapling(moduleApi);
      var teaser = SP.Teaser(
          moduleApi, renderContext.getWidth(), renderContext.getHeight());

      SP.Platform.addListener(
          canvas, 'mousedown', function canvasClicked(event) {
        teaser.pause();
        sapling.addDrop(event.clientX, event.clientY);
      });
      SP.Platform.addListener(window, 'resize', function windowResized(event) {
        renderContext.resize();
        var width = renderContext.getWidth();
        var height = renderContext.getHeight();
        teaser.pause();
        teaser.width = width;
        teaser.height = height;
      });

      teaser.onPoke(function teaserPoke(x, y) {
        sapling.addDrop(x, y);
      });
      
      return self;
    }
  };
  return self;
};
