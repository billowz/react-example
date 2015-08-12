let {PropTypes} = require('react'),
  DomUtil = require('../util/dom');

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

  isAutoCloseDropdown() {
    return this.props.autoCloseDropdown;
  },

  handleDocumentKeyUp(e) {
    if (e.keyCode === 27) {
      this.setDropdownState(false);
    }
  },

  handleDocumentClick(e) {
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
    this._onDocumentClickListener = DomUtil.on(window.document, 'click', this.handleDocumentClick);
    this._onDocumentKeyupListener = DomUtil.on(window.document, 'keyup', this.handleDocumentKeyUp);
  },

  unbindRootCloseHandlers() {
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
    }

    if (this._onDocumentKeyupListener) {
      this._onDocumentKeyupListener.remove();
    }
  },
  componentWillUnmount() {
    this.unbindRootCloseHandlers();
  }
};

export default DropdownStateMixin;
