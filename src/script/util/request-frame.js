var Util = require('./core');
module.exports = (function(window) {
  var prefixes = 'webkit moz ms o'.split(' ');
  function getFrame(prop, defaultVal) {
    var val = window[prop],
      i = 0;
    if (val) {
      return val;
    }
    for (; i < prefixes.length; i++) {
      if( (val = window[prefixes[i] + Util.upperFirst(prop)]) ) {
        return val;
      }
    }
    return defaultVal;
  }

  var lastTime = 0,
    request = getFrame('requestAnimationFrame', function requestAnimationFrame(callback) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    }).bind(window),
    cancel = getFrame('cancelAnimationFrame', function cancelAnimationFrame(reqId) {
      clearTimeout(id);
    }).bind(window),
    duration = function(duration, onStep, onEnd) {
      var t = new Date(),
        reqid,
        step = 0,
        calc = function() {
          try {
            if (!reqid) {
              return;
            } else if ((step = new Date() - t) >= duration) {
              onEnd();
              reqid = null;
            } else {
              onStep(step);
              reqid = request(calc);
            }
          } catch (e) {
            Util.error(e);
            onEnd(e.message);
          }
        };
      reqid = request(calc);
      return function() {
        if (reqid) {
          cancel(reqid);
          reqid = null;
          onEnd('cancel');
        }
      }
    };
  return {
    request: request,
    cancel: cancel,
    duration: duration
  };
})(window);
