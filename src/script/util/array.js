let {is} = require('./core');
function unique() {
  let ret = [],
    i = 0;
  for (; i < arguments.length; i++) {
    if (!is.array(arguments[i])) {
      throw 'Invalid Array';
    }
    arguments[i].forEach(function(item) {
      if (ret.indexOf(item) == -1) {
        ret.push(item);
      }
    });
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
    if (arguments.length == 2) {
      vals = vals[0];
    }
    if (!is.array(vals)) {
      vals = [vals];
    }
    vals.forEach(function(val) {
      if (array.indexOf(val) == -1) {
        array.push(val);
      }
    });
    return array;
  },

  removes(array, ...remVals) {
    if (!is.array(array)) {
      throw 'Invalid Array';
    }
    if (arguments.length == 2) {
      remVals = remVals[0];
    }
    if (!is.array(remVals)) {
      remVals = [remVals];
    }
    remVals.forEach(function(val) {
      let idx;
      while ((idx = array.indexOf(val)) != -1) {
        array.splice(idx, 1);
      }
    });
  }
}
module.exports = arrayUtil;
