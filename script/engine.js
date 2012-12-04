SP.Engine = function spEngine(api, timeWindowMS) {
  var self;
  var executionQueue = [];
  var nextActionId = 0;
  var pendingTimeout;
  var lastIdleTime;
  var stats = {
    averageJobsPerFrame: 0,
    longActionCount: 0
  };

  function buildActionId(id) {
    return 'sp:id:' + id;
  }

  function reportActions() {
    // Add one in case it was too small to measure.
    var durationActive = (api.now() - lastIdleTime + 1) / 1000;
    if (stats.longActionCount) {
      api.log('Jobs per Second: ' + Math.round(nextActionId / durationActive) +
              ' Long Action count: ' + stats.longActionCount);
    }
  }

  function runQueue() {
    var endingTime = SP.Platform.now() + timeWindowMS;
    var jobToRun;
    var jobsRunInTimeWindow = 0;
    var jobIndex = 0;
    var currentQueue = executionQueue.slice(0);

    while (SP.Platform.now() < endingTime && jobIndex < currentQueue.length) {
      jobToRun = currentQueue[jobIndex];
      jobIndex += 1;
      jobToRun.action();
    }

    if (jobIndex < currentQueue.length) {
      // Unable to execute all pending jobs within the time window, not
      // necessarily a bad thing, it means we've avoided locking the execution
      // for more than window time to allow for fluid jobs where possible.

      if (jobsRunInTimeWindow === 1) {
        // Some job(s) took a very long time. This is more dire of a situation,
        // indicating we do not have granular enough jobs.
        stats.longActionCount += 1;
      }
    }

    // Remove the jobs we just ran.
    executionQueue.splice(0, jobIndex);

    if (executionQueue.length) {
      // More to go, request another timeout.
      pendingTimeout = api.queue(runQueue);
    } else {
      // We finished all our jobs.
      reportActions();
      pendingTimeout = undefined;
      nextActionId = 0;
    }
  }

  self = {
    addAction: function engineAddAction(action) {
      var id = nextActionId + 1;
      var actionId = buildActionId(id);

      nextActionId += 1;

      executionQueue.push({
        id: actionId,
        action: action
      });

      if (!pendingTimeout) {
        lastIdleTime = api.now();
        pendingTimeout = api.queue(runQueue);
      }
      return id;
    },
    getStats: function engineGetStats() {
      return stats;
    }
  };
  return self;
};
