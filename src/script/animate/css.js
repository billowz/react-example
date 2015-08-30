let CssEvent = require('./css-event'),
  Util = require('../util/util'),
  Effects = require('./effects'),
  AnimationFrame = Util.requestFrame,
  {is, dom, array} = Util;

class AnimateProcessor {
  constructor(option) {
    Util.assignWithout(this, ['run', 'stop'], option);
    if (!is.element(this.el)) {
      throw 'Invalid Element';
    }
  }
  run() {
    throw 'Abstract Method run';
  }
  stop() {
    throw 'Abstract Method stop';
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
    /*if (!(AnimateProcessor.isPrototypeOf(processor))) {
      throw 'Invalid Processor';
    }*/
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
  constructor(el, transition) {
    if (!is.element(el)) {
      throw 'Invalid Element';
    }
    if (!transition) {
      throw 'Invalid Transition';
    }
    if (!is.array(transition)) {
      transition = [transition];
    }
    this.el = el;
    this.transition = transition;
    let processors = [];
    transition.forEach(function(transitionItem) {
      let trans = [];
      transitionDefines.forEach(function(define) {
        let tran,
          Processor = define.processor,
          option = define.option || {};
        if ( (tran = define.parseTransition.call(define, transitionItem)) ) {
          option = Util.assign({}, option, {
            transition: tran,
            el: el
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
  run() {
    return Util.promiseAll(this.animateProcessors.map(function(pro) {
      return pro.run();
    }));
  }
  stop() {
    this.animateProcessors.forEach(function(pro) {
      pro.stop();
    });
  }
}


class AbstractCssAnimateProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
    this.el.__transition = this.el.__transition || new Map();
  }
  run() {
    this.stop();
    return Util.promise(function(def) {
      if (!CssEvent.isSupport()) {
        setTimeout(def.reject.bind(def, this, 'CSS Transition is Not Supported'), 0);
      } else {
        let listen = function(e) {
          if (e && e.target !== this.el) {
            return;
          }
          if (listen._timeout) {
            clearTimeout(listen._timeout);
          }
          this._endTransition();
          def.resolve(this);
        }.bind(this);

        listen._timeout = setTimeout(function() {
          this._endTransition();
          def.reject(this, 'CSS Transition Timeout');
        }.bind(this), 30000);

        this._setEndListen(listen);
        CssEvent.onEnd(this.el, listen);
        this._start();
      }
    }.bind(this));
  }
  stop() {
    let listen;
    if ( (listen = this._getEndListen()) ) {
      listen();
    }
  }
  _setEndListen(listen) {
    this.el.__transition.set(this.transition, listen);
  }
  _getEndListen() {
    return this.el.__transition.get(this.transition);
  }
  _endTransition() {
    let listen = this._getEndListen();
    if (listen) {
      CssEvent.unEnd(this.el, listen);
      this._setEndListen(undefined);
    }
    this._end();
  }
  _start() {
    throw 'Abstract Method start';
  }
  _end() {
    throw 'Abstract Method end';
  }
}

class ClassNameAnimateProcessor extends AbstractCssAnimateProcessor {
  constructor(option) {
    super(option);
  }
  _start() {
    dom.addCls(this.el, this.transition);
  }
  _end() {
    dom.removeCls(this.el, this.transition);
  }
}

class StyleAnimateProcessor extends AbstractCssAnimateProcessor {
  constructor(option) {
    super(option);
    this._cssNames = Object.keys(this.transition);
  }
  _start() {
    this._oldCss = dom.innerCss(this.el, this._cssNames);
    dom.css(this.el, this.transition);
  }
  _end() {
    dom.css(this.el, this._oldCss);
  }
}

class TweenFrameProcessor extends AnimateProcessor {
  constructor(option) {
    super(option);
    this.effect = this.transition.effect || 'linear';
    if (is.string(this.effect)) {
      this.effect = Effects[this.effect];
    }
    if (!is.fn(this.effect)) {
      throw 'Invalid effect ' + this.transition.effect;
    }
    this.duration = this.transition.duration || 500;
    if (!is.number(this.duration)) {
      throw 'Invalid duration ' + this.transition.duration;
    }
    this.from = this.transition.from || {};
    this.keepTarget = this.transition.keepTarget === true;
    this.target = this.transition.target || Util.assignWithout({}, ['effect', 'duration', 'from'], this.transition);
    this._targetCssNames = Object.keys(this.target);
    this._fromCssNames = Object.keys(this.from);
    this._cssNames = array.uniquePush.apply(null, [[]].concat(this._targetCssNames).concat(this._fromCssNames));
  }
  run() {
    this.stop();
    return Util.promise((def) => {
      this._beforeTransition();
      this._animate = AnimationFrame.duration(this.duration,
        this._calStyles.bind(this), (err) => {
          this._animate = null;
          this._endTransition();
          if (err) {
            def.reject(err);
          } else {
            def.resolve();
          }
        });
    });
  }
  stop() {
    if (this._animate) {
      this._animate();
    }
  }
  _calStyles(step) {
    Object.keys(this._animateObj).forEach(function(name) {
      let ani = this._animateObj[name],
        style = this.effect(step, ani.from, ani.variation, this.duration) + ani.unit;
      dom.css(this.el, name, style);
    }.bind(this));
  }
  _beforeTransition() {
    this._oldCss = dom.innerCss(this.el, this._cssNames);
    let fromCss, targetCss;
    dom.css(this.el, this.target);
    targetCss = dom.css(this.el, this._targetCssNames);
    dom.css(this.el, Util.assign({}, this._oldCss, this.from || {}));
    fromCss = dom.css(this.el, this._targetCssNames);

    this._animateObj = {};
    this._targetCssNames.forEach((name) => {
      let from = parseFloat(fromCss[name]),
        to = parseFloat(targetCss[name]),
        unit = name === 'opacity' ? '' : 'px',
        variation = to - from;
      this._animateObj[name] = {
        from: from,
        end: to,
        variation: variation,
        unit: unit
      }
    });
  }
  _endTransition() {
    this.promise = null;
    if (!this.keepTarget) {
      dom.css(this.el, this._oldCss);
    }
    this._oldCss = null;
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
  processor: StyleAnimateProcessor,
  parseTransition(tran) {
    if (is.hash(tran) && is.hash(tran['css'])) {
      return tran['css'];
    }
  }
}, {
  processor: TweenFrameProcessor,
  parseTransition(tran) {
    if (is.hash(tran) && is.hash(tran['tween'])) {
      return tran['tween'];
    }
  }
}]);

Util.assign(Animate, {
  registerAnimate: registerAnimate,
  AnimateProcessor: AnimateProcessor,
  AbstractCssAnimateProcessor: AbstractCssAnimateProcessor,
  ClassNameAnimateProcessor: ClassNameAnimateProcessor,
  StyleAnimateProcessor: StyleAnimateProcessor,
  TweenFrameProcessor: TweenFrameProcessor
});
module.exports = Animate;
