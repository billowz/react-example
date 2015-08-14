let Util = require('../util/util');
module.exports = (function(window) {
  let prefixes = 'webkit moz ms o'.split(' ');
  function getFrame(prop, defaultVal) {
    let val = window[prop],
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

  var lastTime = 0;
  return {
    request: getFrame('requestAnimationFrame', function requestAnimationFrame(callback) {
      let currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    }).bind(window),
    cancel: getFrame('cancelAnimationFrame', function cancelAnimationFrame(reqId) {
      clearTimeout(id);
    }).bind(window)
  };
})(window);
