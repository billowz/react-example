let is = require('is'),
  Util = require('./core');
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

let Dom = {
  on(el, evt, callback) {
    checkHtml(el);
    if (el.addEventListener) {
      el.addEventListener(evt, callback, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + evt, callback);
    }
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
    }
  },
  innerCss(el, attr) {
    checkEl(el);
    return getStyle(el, attr, true);
  },
  cleanInnerCss(el, ...attrNames) {
    checkEl(el);
    if (arguments.length == 2) {
      attrNames = attrNames[0];
    }
    if (is.array(attrNames)) {
      attrNames.forEach(function(attr) {
        el.style[attr] = undefined;
      });
    } else if (is.string(attrNames)) {
      el.style[attrNames] = undefined;
    } else {
      throw 'Invalid Css Name';
    }
  },
  hasCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    if (is.string(cls)) {
      cls = cls.split(/\s+/g);
    }
    if (is.array(cls)) {
      let clsNames = el.className;
      for (let i = 0; i < cls.length; i++) {
        if (clsNames.match(clsReg(cls[i].trim()))) {
          return true;
        }
      }
      return false;
    } else {
      throw 'Invalid ClassName'
    }
  },
  addCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    if (is.string(cls)) {
      cls = cls.split(/\s+/g);
    }
    let clss = el.className ? el.className.split(/\s+/g) : [];
    Util.pushDistinctArray(clss, cls);
    el.className = clss.join(' ');
  },
  removeCls(el, ...cls) {
    checkEl(el);
    if (arguments.length == 2) {
      cls = cls[0];
    }
    if (is.string(cls)) {
      cls = cls.split(/\s+/g);
    }
    if (el.className) {
      let clss = el.className.split(/\s+/g);
      Util.removeArrayValues(clss, cls);
      el.className = clss.join(' ');
    }
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
