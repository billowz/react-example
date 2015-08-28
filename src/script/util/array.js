let {is} = require('./core');
function unique() {
  let ret = [],
    i = 0,
    args = arguments;
  function pusher(item) {
    if (ret.indexOf(item) == -1) {
      ret.push(item);
    }
  }
  for (; i < args.length; i++) {
    if (!is.array(args[i])) {
      throw 'Invalid Array';
    }
    args[i].forEach(pusher);
  }
  return ret;
}
let arrayUtil = {
  unique: unique,
  union: unique,
  diff() {
    let ret = [],
      i = 0,
      args = arguments;
    for (; i < args.length; i++) {
      if (!is.array(args[i])) {
        throw 'Invalid Array';
      }
      ret = ret.concat(args[i]);
    }
    return ret.filter(v => {
      for (var i = 0; i < args.length; i++) {
        if (!args[i].includes(v)) {
          return true;
        }
      }
      return false;
    });
  },

  uniquePush(array, ...vals) {
    if (!is.array(array)) {
      throw 'Invalid Array';
    }
    return vals.filter(function(val) {
      if (array.indexOf(val) == -1) {
        array.push(val);
        return true;
      }
      return false;
    });
  },

  remove(array, ...vals) {
    if (!is.array(array)) {
      throw 'Invalid Array';
    }
    vals.forEach(function(val) {
      let idx;
      while ((idx = array.indexOf(val)) != -1) {
        array.splice(idx, 1);
      }
    });
  }
}
module.exports = arrayUtil;
