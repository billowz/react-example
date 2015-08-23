/**!
 * React UI Module:util
 */
let base = require('./core');
base.assign(base, {
  array: require('./array'),
  dom: require('./dom'),
  observe: require('./observe'),
  cookie: require('./cookie'),
  requestFrame: require('./request-frame')
});
module.exports = base;
