let {PropTypes} = require('react');
/**
 * Checks whether a node is within
 * a root nodes tree
 *
 * @param {DOMElement} node
 * @param {DOMElement} root
 * @returns {boolean}
 */
function isNodeInRoot(node, root) {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

const DropdownStateMixin = {
  propTypes: {
    autoCloseDropdown: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      autoCloseDropdown: true
    }
  },
  getInitialState() {
    return {
      isDropdown: false
    };
  },

  setDropdownState(newState, onStateChangeComplete) {
    if (newState) {
      this.bindRootCloseHandlers();
    } else {
      this.unbindRootCloseHandlers();
    }

    this.setState({
      isDropdown: newState
    }, onStateChangeComplete);
  },

  isDropdown() {
    return this.state.isDropdown;
  },

  isAutoCloseDropdown(){
    return this.props.autoCloseDropdown;
  },

  handleDocumentKeyUp(e) {
    if (e.keyCode === 27) {
      this.setDropdownState(false);
    }
  },

  handleDocumentClick(e) {
    // If the click originated from within this component
    // don't do anything.
    // e.srcElement is required for IE8 as e.target is undefined
    let target = e.target || e.srcElement;
    if (isNodeInRoot(target, React.findDOMNode(this))) {
      return;
    }

    this.setDropdownState(false);
  },

  bindRootCloseHandlers() {
    if (!this.props.autoCloseDropdown) {
      return;
    }
    let doc = window.document;
    this._onDocumentClickListener = this.listen(doc, 'click', this.handleDocumentClick);
    this._onDocumentKeyupListener = this.listen(doc, 'keyup', this.handleDocumentKeyUp);
  },

  unbindRootCloseHandlers() {
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
    }

    if (this._onDocumentKeyupListener) {
      this._onDocumentKeyupListener.remove();
    }
  },
  listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },
  componentWillUnmount() {
    this.unbindRootCloseHandlers();
  }
};

export default DropdownStateMixin;
