/**!
 * React UI Module:util
 */
let base = require('./core');
base.assign(base, {
  dom: require('./dom'),
  watch: require('./watch')
});
module.exports = base;
