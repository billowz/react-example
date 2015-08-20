/**!
 * React UI Module:util
 */
let base = require('./core');
base.assign(base, {
  dom: require('./dom'),
  observe: require('./observe'),
  cookie: require('./cookie')
});
module.exports = base;
