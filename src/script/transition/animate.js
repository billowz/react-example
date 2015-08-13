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

class CapacityAnimateProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
  }
  run() {
    this.stop();
    this.transition
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
  CapacityAnimateProcessor: CapacityAnimateProcessor
});
module.exports = Animate;
