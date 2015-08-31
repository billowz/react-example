let React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  {dom} = Util,
  Mixins = require('../mixins/mixins'),
  {DocumentEvent, Status} = Mixins,
  Transition = require('../transition/transition'),
  {TreeNode} = require('../tree/tree');

let MenuItem = React.createClass({
  mixins: [
    DocumentEvent({
      prop: 'open',
      autoBindProp: 'autoClose',
      buildAutoBindProp: true
    }),
    Status({
      prop: 'selected',
      type: PropTypes.bool,
      value: false
    })
  ],
  propTypes: {
    text: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    onSelect: PropTypes.func,
    children: PropTypes.array,
    animation: PropTypes.object
  },
  getDefaultProps() {
    return {
      animation: {
        open: {
          true: {
            tween: {
              from: {
                overflow: 'hidden',
                height: '0px'
              },
              height: 'auto',
              effect: 'bounce-out'
            }
          },
          false: {
            tween: {
              from: {
                overflow: 'hidden',
                display: 'inline-block'
              },
              height: '0px',
              effect: 'circ-in'
            }
          }
        }
      }
    }
  },
  render() {
    let cls = Util.parseClassName(
      'pure-menu-item',
      this.hasSub() && 'pure-menu-has-children',
      this.isOpen() && 'pure-menu-active',
      this.isSelected() && 'pure-menu-selected'
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
      let subItems = this.props.children.map((c, idx) => {
        return <MenuItem {...c} ref={idx} key={idx} onSelect={this.onSelectSub}
          autoClose={this.props.autoClose}></MenuItem>
        });
        return <Transition id={this.id} component='ul' className="pure-menu-children" open={this.isOpen()}
          animation={this.props.animation} >{subItems}</Transition>
      }
    },
    onSelectSub(hierarchy) {
      if (this.props.autoClose) {
        this.setOpen(false);
      }
      hierarchy.splice(0, 0, this);
      this.props.onSelect(hierarchy);
    },
    select() {
      this.setSelected(true);
    },
    unSelect() {
      this.setSelected(false);
      Object.keys(this.refs).forEach((key) => {
        this.refs[key].unSelect();
      });
    },
    onClickLink(e) {
      e.preventDefault();
      if (this.hasSub()) {
        this.setOpen(!this.isOpen());
      } else {
        this.props.onSelect([this]);
      }
    },
    hasSub() {
      return this.props.children && this.props.children.length > 0;
    }
  });

  const MENU_ITEM_PREFIX = 'menu-item';
  /* let Menu = Compontent('Menu', {
     mixins: [
       DocumentEvent({
         prop: 'open',
         autoBindProp: 'horizontal'
       })
     ],
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
         return this.state.data.map((c, idx) => {
           return <MenuItem {...c} ref={MENU_ITEM_PREFIX + idx} key={idx}
             onSelect={this.onMenuSelect} autoClose={this.props.horizontal}></MenuItem>;
         });
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
   });*/


  let Menu = Compontent('Menu', {
    mixins: [
      DocumentEvent({
        prop: 'open',
        autoBindProp: 'horizontal'
      })
    ],
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
      console.log(this.renderMenu())
      return <div className={cls} {...this.props}>
              {this.renderHeader()}{this.renderMenu()}
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
        return this.state.data.map((c, idx) => {
          return <TreeNode  key={idx}>
              <TreeNode>123</TreeNode>
                </TreeNode>;
        });
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
