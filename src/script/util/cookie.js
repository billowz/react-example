let Util = require('./core'),
  pluses = /\+/g;

function raw(s) {
  return s;
}

function decoded(s) {
  return decodeURIComponent(s.replace(pluses, ' '));
}

function converted(s) {
  if (s.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape
    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  return config.json ? JSON.parse(s) : s;
}
let config, cookie;
config = cookie = function cookie(key, value, options) {

  // write
  if (value !== undefined) {
    options = Util.assign({}, config.defaults, options || {});

    if (typeof options.expires === 'number') {
      let days = options.expires,
        t = options.expires = new Date();
      t.setDate(t.getDate() + days);
    }

    value = config.json ? JSON.stringify(value) : String(value);

    return (document.cookie = [
      config.raw ? key : encodeURIComponent(key),
      '=',
      config.raw ? value : encodeURIComponent(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''));
  }

  // read
  let decode = config.raw ? raw : decoded,
    cookies = document.cookie.split('; '),
    result = key ? undefined : {};
  for (let i = 0, l = cookies.length; i < l; i++) {
    let parts = cookies[i].split('='),
      name = decode(parts.shift()),
      cookie = decode(parts.join('='));

    if (key && key === name) {
      result = converted(cookie);
      break;
    }

    if (!key) {
      result[name] = converted(cookie);
    }
  }

  return result;
}

config.defaults = {};
cookie.remove = function(key, options) {
  if (cookie(key) !== undefined) {
    // Must not alter options, thus extending a fresh object...
    cookie(key, '', Util.assign({}, options, {
      expires: -1
    }));
    return true;
  }
  return false;
}
module.exports = cookie;
