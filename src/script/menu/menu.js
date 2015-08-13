let React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  DropdownMixins = require('../dropdown/dropdown-mixins'),
  Transition = require('../transition/transition');

let MenuItem = React.createClass({
  mixins: [DropdownMixins],
  propTypes: {
    text: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    onSelect: PropTypes.func,
    children: PropTypes.array,
    dropdownAnimation: PropTypes.object
  },
  getDefaultProps() {
    return {
      dropdownAnimation: {
        dropdown: {
          true: {
            class: ['animated', 'fadeInDown']
          },
          false: {
            class: ['animated', 'fadeOutUp']
          }
        }
      }
    }
  },
  getInitialState() {
    return {
      isSelected: false
    };
  },
  render() {
    let cls = Util.parseClassName(
      'pure-menu-item',
      this.hasSub() && 'pure-menu-has-children',
      this.state.isDropdown && 'pure-menu-active',
      this.state.isSelected && 'pure-menu-selected'
    );
    return <li className={cls}>{this.renderLink()}{this.renderSubs()}</li>
  },
  renderLink() {
    if (this.props.href && !this.hasSub()) {
      return <a className='pure-menu-link' onTouchTap={this.onClickLink} href={this.props.href}>
                {this.props.text}
            </a>;
    } else {
      return <span className='pure-menu-link' onTouchTap={this.onClickLink}>
                {this.props.text}
            </span>;
    }
  },
  renderSubs() {
    if (!this.id) {

      this.id = new Date().toString();
    }
    if (this.hasSub()) {
      let subItems = this.props.children.map(function(c, idx) {
        return <MenuItem {...c} ref={idx} key={idx} onSelect={this.onSelectSub}
          autoCloseDropdown={this.props.autoCloseDropdown}></MenuItem>
      }.bind(this));
      return <Transition id={this.id} component='ul' className="pure-menu-children" dropdown={this.state.isDropdown}
        animation={this.props.dropdownAnimation}>{subItems}</Transition>
    }
  },
  onSelectSub(hierarchy) {
    if (this.isAutoCloseDropdown()) {
      this.setDropdownState(false);
    }
    hierarchy.splice(0, 0, this);
    this.props.onSelect(hierarchy);
  },
  select() {
    this.setState({
      isSelected: true
    });
  },
  unSelect() {
    this.setState({
      isSelected: false
    });
    Object.keys(this.refs).forEach(function(key) {
      this.refs[key].unSelect();
    }.bind(this))
  },
  isSelect() {
    return this.state.isSelected;
  },
  onClickLink(e) {
    e.preventDefault();
    if (this.hasSub()) {
      this.setDropdownState(!this.isDropdown());
      console.log(this.id, this.isDropdown())
    } else {
      this.props.onSelect([this]);
    }
  },
  hasSub() {
    return this.props.children && this.props.children.length > 0;
  }
});

const MENU_ITEM_PREFIX = 'menu-item';
let Menu = Compontent('Menu', {
  mixins: [DropdownMixins],
  propTypes: {
    horizontal: PropTypes.bool,
    onSelectMenu: PropTypes.func
  },
  getDefaultProps() {
    return {
      horizontal: true,
      menuAnimation: {
        enter: {
          class: ['animated', 'fadeInDown']
        },
        leave: {
          class: ['animated', 'fadeOutDown']
        }
      }
    }
  },
  render() {
    const {className, horizontal} = this.props;
    const cls = Util.parseClassName(
      'pure-menu', className,
      horizontal && 'pure-menu-horizontal',
      !horizontal && 'pure-menu-vertical'
    );
    return <div className={cls} {...this.props}>
              {this.renderHeader()}
              <Transition component="ul" className='pure-menu-list' animation={this.props.menuAnimation}>{this.renderMenu()}</Transition>
          </div>;
  },
  renderHeader() {
    let headerCls = Util.parseClassName('pure-menu-heading', this.props.titleLink && 'pure-menu-link');
    if (this.props.title) {
      if (this.props.titleLink) {
        return <a className={headerCls}>{this.props.title}</a>;
      }
      return <span className={headerCls}>{this.props.title}</span>;
    }
  },
  renderMenu() {
    if (this.state.data) {
      return this.state.data.map(function(c, idx) {
        return <MenuItem {...c} ref={MENU_ITEM_PREFIX + idx} key={idx}
          onSelect={this.onMenuSelect} autoCloseDropdown={this.props.horizontal}></MenuItem>;
      }.bind(this));
    }
  },
  onMenuSelect(hierarchy) {
    Object.keys(this.refs).forEach(function(key) {
      console.log(typeof key, ' ', key)
      if (key.indexOf(MENU_ITEM_PREFIX) == 0) {
        this.refs[key].unSelect();
      }
    }.bind(this));
    hierarchy.forEach(function(item) {
      item.select();
    });
    if (this.props.onSelectMenu) {
      this.props.onSelectMenu(hierarchy);
    }
  }
});
module.exports = Menu;
