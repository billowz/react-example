let {is} = require('./core'),
  array = require('./array');
function clsReg(cls) {
  return new RegExp('(\\s+|^)' + cls + '(\\s+|$)');
}
function checkEl(el) {
  if (!is.element(el)) {
    throw 'Invalid Element ' + el;
  }
}
function checkHtml(el) {
  if (!is.element(el) && !(el instanceof Document) && !(el instanceof Window)) {
    throw 'Invalid Element ' + el;
  }
}
let prefix = ['webkit', 'moz', 'ms', 'o'],
  cssSupport = (function() {
    let testElem = document.createElement('otarim'),
      testStyle = testElem.style,
      test = function(cssText) {
        testStyle.cssText = cssText;
      },
      support = {
        opacity: (function() {
          test('opacity: .5');
          return (/^0.5$/).test(testStyle.opacity);
        })()
      }
    return support;
  })(),
  cssHooks = (function() {
    let ropacity = /opacity=([^)]*)/,
      ralpha = /alpha\([^)]*\)/;
    return {
      opacity: {
        get: function(style) {
          if (!cssSupport.opacity) {
            return (ropacity.test(style.filter || '') ?
                (parseFloat(RegExp.$1) / 100) + '' : '') || '1';
          }
          return style['opacity'];
        },
        set: function(el, value) {
          let style = el.style, opacity, filter;
          if (!cssSupport.opacity) {
            style.zoom = 1;
            opacity = isNaN(+value) ? '' : 'alpha(opacity=' + value * 100 + ')';
            if (value >= 1) {
              opacity = '';
            }
            filter = style.filter || '';
            style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
          } else {
            style.opacity = value;
          }
        }
      }
    }
  })(),
  setStyle = function(el, prop, value) {
    if (cssHooks[prop]) {
      cssHooks[prop].set(el, value);
    }
    el.style[prop] = value;
  },
  getStyle = function(el, prop, inner) {
    let style,
      ret = {},
      objRet = true;
    if (!prop) {
      return undefined;
    }
    if (!is.array(prop)) {
      prop = [prop];
      objRet = false;
    }
    if (prop.length > 0) {
      if (inner) {
        style = el.style;
      } else if (document.defaultView && document.defaultView.getComputedStyle) {
        style = document.defaultView.getComputedStyle(el, null);
      } else {
        style = el.currentStyle;
      }
      prop.forEach(function(prop) {
        if (cssHooks[prop]) {
          ret[prop] = cssHooks[prop].get(style);
        } else {
          ret[prop] = style[prop];
        }
      });
      return objRet ? ret : ret[prop[0]];
    }
    return objRet ? {} : undefined;
  };
function parseClsArgs(cls) {
  return array.mapArray(cls, (cls) => {
    if (is.string(cls)) {
      return cls.split(/\s+/g);
    } else if (is.array(cls)) {
      return array.mapArray(cls, cls => is.string(cls) ? cls.split(/\s+/g) : []);
    } else {
      return [];
    }
  });
}
let Dom = {
  isDecendantOf(el, targetEl) {
    checkEl(el);
    checkEl(targetEl);
    while (el) {
      if (el === targetEl) {
        return true;
      }
      el = el.parentNode;
    }
    return false;
  },
  on(el, evt, callback) {
    checkHtml(el);
    if (el.addEventListener) {
      el.addEventListener(evt, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + evt, callback);
    }
    return Dom.un.bind(this, el, evt, callback);
  },
  un(el, evt, callback) {
    checkHtml(el);
    if (el.addEventListener) {
      el.removeEventListener(evt, callback, false);
    } else if (el.attachEvent) {
      el.detachEvent('on' + evt, callback);
    }
  },

  css(el, attr, value) {
    checkEl(el);
    if (arguments.length === 2) {
      if (is.hash(attr)) {
        Object.keys(attr).forEach(function(att) {
          setStyle(el, att, attr[att]);
        });
      } else {
        return getStyle(el, attr);
      }
    } else if (arguments.length === 3) {
      setStyle(el, attr, value);
    } else {
      throw 'Invalid Css Name';
    }
  },
  innerCss(el, attr) {
    checkEl(el);
    return getStyle(el, attr, true);
  },
  cleanInnerCss(el, ...attrNames) {
    checkEl(el);
    attrNames.forEach(function(attr) {
      el.style[attr] = undefined;
    });
  },
  hasCls(el, ...cls) {
    checkEl(el);
    cls = parseClsArgs(cls);
    if (cls.length > 0) {
      var clsNames = el.className,
        i = 0;
      for (; i < cls.length; i++) {
        if (clsNames.match(clsReg(cls[i].trim()))) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }

  },
  addCls(el, ...cls) {
    checkEl(el);
    var ret;
    cls = parseClsArgs(cls);
    if (cls.length > 0) {
      var clss = el.className ? el.className.split(/\s+/g) : [];
      ret = array.uniquePush.apply(null, [clss].concat(cls));
      el.className = clss.join(' ');
    }
    return ret || [];
  },
  removeCls(el, ...cls) {
    checkEl(el);
    var ret;
    cls = parseClsArgs(cls);
    if (cls.length > 0) {
      var clss = el.className ? el.className.split(/\s+/g) : [];
      ret = array.remove.apply(null, [clss].concat(cls));
      el.className = clss.join(' ');
    }
    return ret || [];
  },
  toggleClass(el, cls) {
    if (Dom.hasCls(el, cls)) {
      Dom.removeCls(el, cls);
    } else {
      Dom.addCls(el, cls);
    }
  }
}
module.exports = Dom;
