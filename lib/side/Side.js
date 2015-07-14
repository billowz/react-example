let React = require('react'),
  { Utils, Mixins, Styles, Paper, Overlay } = require('material-ui'),
  { KeyCode } = Utils,
  { StylePropable, WindowListenable } = Mixins,
  { Transitions, AutoPrefix } = Styles;

let Side = React.createClass({displayName: "Side",
  mixins: [StylePropable, WindowListenable],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  propTypes: {
    className: React.PropTypes.string,
    docked: React.PropTypes.bool,
    model: React.PropTypes.bool,
    header: React.PropTypes.element,
    onChange: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    direction: React.PropTypes.string
  },
  windowListeners: {
    'keyup': '_onWindowKeyUp',
    'resize': '_onWindowResize',
  },
  getDefaultProps() {
    return {
      docked: true,
      model: true,
      direction: 'left'
    };
  },
  getInitialState() {
    return {
      open: this.props.docked,
      maybeSwiping: false,
      swiping: null,
    };
  },
  toggle() {
    this.setState({
      open: !this.state.open
    });
    return this;
  },
  close() {
    this.setState({
      open: false
    });
    if (this.props.onClose) this.props.onClose();
    return this;
  },
  open() {
    this.setState({
      open: true
    });
    if (this.props.onOpen) this.props.onOpen();
    return this;
  },
  getThemePalette() {
    return this.context.muiTheme.palette;
  },
  getTheme() {
    return this.context.muiTheme.component.leftNav;
  },
  getStyles() {
    let x = this._getTranslateMultiplier() * (this.state.open ? 0 : this._getMaxTranslateX());
    let styles = {
      root: {
        height: '100%',
        width: this.getTheme().width,
        position: 'fixed',
        zIndex: 10,
        left: 0,
        top: 0,
        transform: 'translate3d(' + x + 'px, 0, 0)',
        transition: !this.state.swiping && Transitions.easeOut(),
        backgroundColor: this.getTheme().color,
        overflow: 'hidden',
      },
      rootWhenOpenRight: {
        left: 'auto',
        right: 0,
      },
      rootWhenOpenTop: {
        left: 'auto',
        right: 0,
      },
      rootWhenOpenBottom: {
        left: 'auto',
        right: 0,
      },
    };

    return styles;
  },
  render() {
    let overlay;
    let styles = this.getStyles();
    if (!this.props.docked) {
      overlay = (React.createElement(Overlay, {ref: "overlay", 
        show: this.state.open, 
        transitionEnabled: !this.state.swiping, 
        onTouchTap: this._onOverlayTouchTap})
      );
    }

    let style = styles.root;
    switch(this.props.direction){
      case 'right':
      style = this.mergeAndPrefix(style, styles.rootWhenOpenRight);
      break;
      case 'top':
      style = this.mergeAndPrefix(style, styles.rootWhenOpenTop);
      break;
      case 'bottom':
      style = this.mergeAndPrefix(style, styles.rootWhenOpenBottom);
      break;
    }
    this.mergeAndPrefix(style, this.props.style);

    return ( React.createElement("div", {className: this.props.className}, 
        overlay, 
        React.createElement(Paper, {ref: "clickAwayableElement", 
          zDepth: 2, 
          rounded: false, 
          transitionEnabled: !this.state.swiping, 
          style: style}, 
            this.props.header
        )
      )
    );
  },
  componentDidMount() {
    this._enableSwipeHandling();
  },
  componentDidUpdate() {
    this._enableSwipeHandling();
  },
  componentWillUnmount() {
    this._disableSwipeHandling();
  },
  _onOverlayTouchTap() {
    this.close();
  },
  _onWindowKeyUp(e) {
    if (e.keyCode === KeyCode.ESC &&
      !this.props.docked &&
      this.state.open) {
      this.close();
    }
  },
  _onWindowResize() {
  },
  _getMaxTranslateX() {
    return this.getTheme().width + 10;
  },
  _getTranslateMultiplier() {
    return this.props.openRight ? 1 : -1;
  },
  _enableSwipeHandling() {
    if (!this.props.docked) {
      document.body.addEventListener('touchstart', this._onBodyTouchStart);
    } else {
      this._disableSwipeHandling();
    }
  },
  _disableSwipeHandling() {
    document.body.removeEventListener('touchstart', this._onBodyTouchStart);
  },
  _onBodyTouchStart(e) {
    let touchStartX = e.touches[0].pageX;
    let touchStartY = e.touches[0].pageY;
    this.setState({
      maybeSwiping: true,
      touchStartX: touchStartX,
      touchStartY: touchStartY,
    });
    document.body.addEventListener('touchmove', this._onBodyTouchMove);
    document.body.addEventListener('touchend', this._onBodyTouchEnd);
    document.body.addEventListener('touchcancel', this._onBodyTouchEnd);
  },
  _setPosition(translateX) {
    let leftNav = React.findDOMNode(this.refs.clickAwayableElement);
    leftNav.style[AutoPrefix.single('transform')] =
      'translate3d(' + (this._getTranslateMultiplier() * translateX) + 'px, 0, 0)';
    this.refs.overlay.setOpacity(1 - translateX / this._getMaxTranslateX());
  },
  _getTranslateX(currentX) {
    return Math.min(
      Math.max(
        this.state.swiping === 'closing' ?
        this._getTranslateMultiplier() * (currentX - this.state.swipeStartX) :
        this._getMaxTranslateX() - this._getTranslateMultiplier() * (this.state.swipeStartX - currentX),
        0
      ),
      this._getMaxTranslateX()
    );
  },
  _onBodyTouchMove(e) {
    let currentX = e.touches[0].pageX;
    let currentY = e.touches[0].pageY;

    if (this.state.swiping) {
      e.preventDefault();
      this._setPosition(this._getTranslateX(currentX));
    } else if (this.state.maybeSwiping) {
      let dXAbs = Math.abs(currentX - this.state.touchStartX);
      let dYAbs = Math.abs(currentY - this.state.touchStartY);
      // If the user has moved his thumb ten pixels in either direction,
      // we can safely make an assumption about whether he was intending
      // to swipe or scroll.
      let threshold = 10;

      if (dXAbs > threshold && dYAbs <= threshold) {
        this.setState({
          swiping: this.state.open ? 'closing' : 'opening',
          open: true,
          swipeStartX: currentX,
        });
        this._setPosition(this._getTranslateX(currentX));
      } else if (dXAbs <= threshold && dYAbs > threshold) {
        this._onBodyTouchEnd();
      }
    }
  },
  _onBodyTouchEnd(e) {
    if (this.state.swiping) {
      let currentX = e.changedTouches[0].pageX;
      let translateRatio = this._getTranslateX(currentX) / this._getMaxTranslateX();

      this.setState({
        maybeSwiping: false,
        swiping: null,
      });

      // We have to open or close after setting swiping to null,
      // because only then CSS transition is enabled.
      if (translateRatio > 0.5) {
        this.close();
      } else {
        this._setPosition(0);
      }
    } else {
      this.setState({
        maybeSwiping: false,
      });
    }

    document.body.removeEventListener('touchmove', this._onBodyTouchMove);
    document.body.removeEventListener('touchend', this._onBodyTouchEnd);
    document.body.removeEventListener('touchcancel', this._onBodyTouchEnd);
  }
});

module.exports = Side;
