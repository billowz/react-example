/**!
 * React UI Module:/tree
 */
var React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent');
var TreeNode = Compontent('TreeNode', {
  mixins: [
    Dropdown('dropdown', false, 'autoCollapse', true),
    Status('selected', false)
  ],
  propTypes: {
    text: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    onSelect: PropTypes.func,
    children: PropTypes.array,
    animation: PropTypes.object
  },
});
module.exports = TreeNode;
