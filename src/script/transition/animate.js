let Event = require('./animate-event'),
  Util = require('../util/util'),
  {is, dom} = Util;

class AnimateProcessor {
  constructor(option) {
    Util.assignWithout(this, ['run', 'stop'], option);
    if (!is.element(this.el)) {
      throw 'Invalid Element';
    }
    this.el.__transition = this.el.__transition || new Map();
  }
  run() {
    throw 'Abstract Method run';
  }
  stop() {
    let listen;
    if ( (listen = this.getEndListen()) ) {
      listen();
    }
  }
  setEndListen(listen) {
    this.el.__transition.set(this.transition, listen);
  }
  getEndListen() {
    return this.el.__transition.get(this.transition);
  }
}

class AbstractCssAnimateProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
  }
  run() {
    this.stop();
    return new Promise(function(resolve, reject) {
      if (!Event.isSupport()) {
        setTimeout(reject.bind(null, this, 'CSS Transition is Not Supported'), 0);
      } else {
        let listen = function(e) {
          if (e && e.target !== this.el) {
            return;
          }
          if (listen._timeout) {
            clearTimeout(listen._timeout);
          }
          this._endTransition();
          resolve(this);
        }.bind(this);

        listen._timeout = setTimeout(function() {
          this._endTransition();
          reject('CSS Transition Timeout');
        }.bind(this), 30000);

        this.setEndListen(listen);
        Event.onEnd(this.el, listen);
        this.start();
      }
    }.bind(this));
  }
  _endTransition() {
    let listen = this.getEndListen();
    if (listen) {
      Event.unEnd(this.el, listen);
      this.setEndListen(undefined);
    }
    this.end();
  }
  start() {
    throw 'Abstract Method start';
  }
  end() {
    throw 'Abstract Method end';
  }
}


let transitionDefines = [],
  transitionProcessorDefined = [];
function registerAnimate(processor, parseTransition, option) {
  if (arguments.length === 1) {
    if (is.array(processor)) {
      processor.forEach(function(pro) {
        registerAnimate(pro);
      })
    } else if (is.hash(processor)) {
      registerAnimate(processor.processor, processor.parseTransition, processor.option);
    } else {
      throw 'Invalid Param'
    }
  } else {
    if (!(AnimateProcessor.isPrototypeOf(processor))) {
      throw 'Invalid Processor';
    }
    if (transitionProcessorDefined.indexOf(processor) != -1) {
      throw 'Animate is Registered ' + processor;
    }
    if (!is.fn(parseTransition)) {
      throw 'Invalid Animate parseTransition';
    }
    transitionDefines.push({
      processor: processor,
      parseTransition: parseTransition,
      option: option
    });
    transitionProcessorDefined.push(processor);
  }
}

class Animate {
  /**
   * Animate Constructor
   * @param  {[Element]}   el         element
   * @param  {[Object]}   transition
   *         transition description
   *         transition = {
   *           class:'transitionClass',
   *           css:{
   *             color:'red'
   *           }
   *         }
   * @param  {Function} callback   callback on Animate End
   * @return {[Animate]}              Animate
   */
  constructor(el, transition, callback) {
    if (!is.element(el)) {
      throw 'Invalid Element';
    }
    if (!transition) {
      throw 'Invalid Transition';
    }
    if (!is.array(transition)) {
      transition = [transition];
    }
    this._executed = [];
    this.el = el;
    this.transition = transition;
    this.onEnd = callback;
    let processors = [],
      processorEnd = this.processorEnd.bind(this);
    transition.forEach(function(transitionItem) {
      let trans = [];
      transitionDefines.forEach(function(define) {
        let tran,
          Processor = define.processor,
          option = define.option || {};
        if ( (tran = define.parseTransition.call(define, transitionItem)) ) {
          option = Util.assign({}, option, {
            transition: tran,
            el: el,
            onEnd: processorEnd
          });
          trans.push(new Processor(option));
        }
      });
      processors.push.apply(processors, trans);
    });
    if (processors.length == 0) {
      throw 'Invalid Transition';
    }
    this.animateProcessors = processors;
  }
  processorEnd(processor) {
    this._executed.push(processor);
    if (this._executed.length == this.animateProcessors.length) {
      if (this.onEnd) {
        this.onEnd();
      }
    }
  }
  run() {
    this.animateProcessors.forEach(function(pro) {
      pro.run();
    });
  }
  stop() {
    this.animateProcessors.forEach(function(pro) {
      pro.stop();
    });
    this._executed = [];
  }
}


class ClassNameAnimateProcessor extends AbstractCssAnimateProcessor {
  constructor(option) {
    super(option);
  }
  start() {
    dom.addCls(this.el, this.transition);
  }
  end() {
    dom.removeCls(this.el, this.transition);
  }
}

class CssAnimateProcessor extends AbstractCssAnimateProcessor {
  constructor(option) {
    super(option);
  }
  start() {
    dom.css(this.el, this.transition);
  }
  end() {
    dom.cleanInnerCss(this.el, Object.keys(this.transition));
  }
}

function getWindowProp(prop, defaultVal) {
  let val = window[prop];
  if (val) {
    return val;
  }
  let prefixes = 'webkit moz ms o'.split(' '), i;
  for (i = 0; i < prefixes.length; i++) {
    if( (val = window[prefixes[i] + Util.upperFirst(prop)]) ) {
      return val;
    }
  }
  return defaultVal;
}

var lastTime = 0;
let requestAnimationFrame = getWindowProp('requestAnimationFrame', function(callback) {
    let currTime = new Date().getTime(),
      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
      id = setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }),
  cancelAnimationFrame = getWindowProp('cancelAnimationFrame', function(reqId) {
    clearTimeout(id);
  });


/*
 * Tween.js
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
*/
var Tween = {
  Linear: function(t, b, c, d) {
    return c * t / d + b;
  },
  Quad: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  },
  Cubic: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    }
  },
  Quart: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
  },
  Quint: {
    easeIn: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOut: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }
  },
  Sine: {
    easeIn: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOut: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOut: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
  },
  Expo: {
    easeIn: function(t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut: function(t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOut: function(t, b, c, d) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  },
  Circ: {
    easeIn: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut: function(t, b, c, d) {
      if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
  },
  Elastic: {
    easeIn: function(t, b, c, d, a, p) {
      var s;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (typeof p == "undefined")
        p = d * .3;
      if (!a || a < Math.abs(c)) {
        s = p / 4;
        a = c;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOut: function(t, b, c, d, a, p) {
      var s;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (typeof p == "undefined")
        p = d * .3;
      if (!a || a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    easeInOut: function(t, b, c, d, a, p) {
      var s;
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (typeof p == "undefined")
        p = d * (.3 * 1.5);
      if (!a || a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    }
  },
  Back: {
    easeIn: function(t, b, c, d, s) {
      if (typeof s == "undefined")
        s = 1.70158;
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut: function(t, b, c, d, s) {
      if (typeof s == "undefined")
        s = 1.70158;
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut: function(t, b, c, d, s) {
      if (typeof s == "undefined")
        s = 1.70158;
      if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
      return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }
  },
  Bounce: {
    easeIn: function(t, b, c, d) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut: function(t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    },
    easeInOut: function(t, b, c, d) {
      if (t < d / 2) {
        return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
      } else {
        return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
      }
    }
  }
}
class RequestAnimationFrameProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
  }
  run() {
    this.stop();

  }
}

registerAnimate([{
  processor: ClassNameAnimateProcessor,
  parseTransition(tran) {
    if (is.string(tran) && tran.trim()) {
      return tran;
    } else if (is.array(tran) &&
      tran.filter(function(n) {
        return is.string(n) && n.trim();
      }).length > 0) {
      return tran;
    } else if (is.hash(tran) && tran['class']) {
      return this.parseTransition(tran['class']);
    }
    return false;
  }
}, {
  processor: CssAnimateProcessor,
  parseTransition(tran) {
    if (is.hash(tran) && is.hash(tran['css']) && Object.keys(tran['css']).length > 0) {
      return tran['css'];
    }
  }
}, {
  processor: CapacityAnimateProcessor,
  parseTransition(tran) {
    if (is.hash(tran) && is.hash(tran['capacity'])) {
      return tran['capacity'];
    }
  }
}]);

Util.assign(Animate, {
  isCssAnimateSupported: Event.endEvents.length > 0,
  registerAnimate: registerAnimate,
  AnimateProcessor: AnimateProcessor,
  AbstractCssAnimateProcessor: AbstractCssAnimateProcessor,
  ClassNameAnimateProcessor: ClassNameAnimateProcessor,
  CssAnimateProcessor: CssAnimateProcessor,
  CapacityAnimateProcessor: RequestAnimationFrameProcessor
});
module.exports = Animate;
