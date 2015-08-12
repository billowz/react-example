let Event = require('./animate-event'),
  Util = require('../util/util'),
  {is, dom} = Util,
  BindEndListenName = 'cssAnimationEndListener';

class AnimateProcessor {
  constructor(option) {
    Util.assignWithout(this, ['run', 'stop'], option);
    if (!is.element(this.el)) {
      throw 'Invalid Element';
    }
  }
  run() {}
  stop() {}
}
;
class CssAnimateProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
    this._endListen = null;
  }
  run() {
    if (this._endListen) {
      this._endListen();
    }
    let _self = this;
    this._endListen = function(e) {
      if (_self !== this || (e && e.target !== this.el)) {
        return;
      }
      Event.unEnd(this.el, this._endListen);
      this._endListen = null;
      this.end.call(this, this);
      if (is.fn(this.onEnd)) {
        this.onEnd();
      }
    }.bind(this);
    Event.onEnd(this.el, this._endListen);
    this.start.call(this);
  }
  stop() {
    if (this._endListen) {
      this._endListen();
    }
  }
}

let transitionDefine = {
  cls: {
    processor: CssAnimateProcessor,
    is(transitionName) {
      if (is.string(transitionName) && transitionName.trim()) {
        return true;
      } else if (is.array(transitionName)) {
        return transitionName.filter(function(n) {
            return is.string(n) && n.trim();
          }).length > 0;
      }
      return false;
    },
    option: {
      start() {
        setTimeout(dom.addCls.bind(dom, this.el, this.transition), 0);
      },
      end() {
        dom.removeCls(this.el, this.transition);
      }
    }
  },
  css: {
    processor: CssAnimateProcessor,
    is(css) {
      return is.hash(css) && Object.keys(css).length > 0;
    },
    option: {
      start() {
        setTimeout(dom.css.bind(dom, this.el, this.transition), 0);
      },
      end() {
        dom.cleanInnerCss(this.el, Object.keys(this.transition));
      }
    }
  }
}
function registerAnimate(name, processor, isFn, option) {
  if (!name) {
    throw 'Invalid Animate Name';
  }
  if (name in transitionDefine) {
    throw 'Animate is Registered ' + name;
  }
  if (!(processor instanceof AnimateProcessor)) {
    throw 'Invalid Processor';
  }
  if (!is.fn(isFn)) {
    throw 'Invalid Animate is'
  }
  transitionDefine[name] = {
    processor: processor,
    is: isFn,
    option: option
  };
}
class Animate {
  constructor(el, transition, callback) {
    if (!is.element(el)) {
      throw 'Invalid Element';
    }
    if (!transition) {
      throw 'Invalid Transition';
    }
    this._executed = [];
    this.el = el;
    this.transition = transition;
    this.onEnd = callback;
    this.AnimateProcessors = Object.keys(transitionDefine)
      .map(function(key) {
        let define = transitionDefine[key],
          tran = this.transition;
        if (!define.is(tran)) {
          if (tran[key]) {
            tran = tran[key];
            if (!define.is(tran)) {
              return null;
            }
          }
        }
        let option = Util.assign({}, define.option || {}, {
          transition: tran,
          el: this.el,
          onEnd: this.processorEnd.bind(this)
        });
        return new define.processor(option);
      }.bind(this)).filter(function(c) {
      return !!c;
    });
    if (this.AnimateProcessors.length == 0) {
      throw 'Invalid Transition';
    }
  }
  processorEnd(processor) {
    this._executed.push(processor);
    if (this._executed.length == this.AnimateProcessors.length) {
      if (this.onEnd) {
        this.onEnd();
      }
    }
  }
  run() {
    this.AnimateProcessors.forEach(function(pro) {
      pro.run();
    });
  }
  stop() {
    this.AnimateProcessors.forEach(function(pro) {
      pro.stop();
    });
    this._executed = [];
  }
}

Animate.isCssAnimateSupported = Event.endEvents.length !== 0;
Animate.registerAnimate = registerAnimate;
Animate.AnimateProcessor = AnimateProcessor;
Animate.CssAnimateProcessor = CssAnimateProcessor;
module.exports = Animate;
