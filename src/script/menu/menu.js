let React = require('react'),
    {PropTypes} = React,
    Compontent = require('../compontent'),
    Util = require('../util/util'),
    DropdownMixins = require('../dropdown/dropdown-mixins');

let MenuItem = React.createClass({
    mixins:[DropdownMixins],
    propTypes : {
        text: PropTypes.string,
        href: PropTypes.string,
        target: PropTypes.string,
        onSelect: PropTypes.func,
        subMenus: PropTypes.array
    },
    getInitialState() {
        return {
            isSelected: false
        };
    },
    render(){
        let cls = Util.parseClassName(
                'pure-menu-item',
                this.hasSub() && 'pure-menu-has-children',
                this.state.isDropdown && 'pure-menu-active',
                this.state.isSelected && 'pure-menu-selected'
            );
        return <li className={cls}>{this.renderLink()}{this.renderSubs()}</li>
    },
    renderLink(){
        if(this.props.href && !this.hasSub()){
            return <a className='pure-menu-link' onTouchTap={this.onClickLink} href={this.props.href}>
                        {this.props.text}
                    </a>;

        }else{
            return <span className='pure-menu-link' onTouchTap={this.onClickLink}>
                        {this.props.text}
                    </span>;
        }
    },
    renderSubs(){
        if(this.hasSub()){
            let subItems = this.props.subMenus.map(function(c, idx){
                return <MenuItem {...c} ref={idx} key={idx} onSelect={this.onSelectSub}></MenuItem>
            }.bind(this));
            return <ul className="pure-menu-children">{subItems}</ul>
        }
    },
    onSelectSub(hierarchy){
        this.setDropdownState(false);
        hierarchy.splice(0, 0, this);
        this.props.onSelect(hierarchy);
    },
    select(){
        this.setState({isSelected:true});
    },
    unSelect(){
        this.setState({isSelected:false});
        Object.keys(this.refs).forEach(function(key){
            this.refs[key].unSelect();
        }.bind(this))
    },
    onClickLink(e){
        e.preventDefault();
        if(this.hasSub()){
            this.setDropdownState(!this.state.isDropdown);
        }else{
            this.props.onSelect([this]);
        }
    },
    hasSub(){
        return this.props.subMenus && this.props.subMenus.length>0;
    }
});
const MENU_ITEM_PREFIX = 'menu-item';
let Menu = Compontent('Menu', {
    mixins:[DropdownMixins],
    propTypes : {
        horizontal: PropTypes.bool,
        onSelectMenu: PropTypes.func
    },
    getDefaultProps(){
        return {
            horizontal: true
        }
    },
    render() {
        const { className, horizontal, title, titleLink, ...props } = this.props;
        const cls = Util.parseClassName(
            'pure-menu', className,
            horizontal && 'pure-menu-horizontal'
        );

        return <div className={cls} {...props}>
                    {this.renderHeader()}
                    <ul className='pure-menu-list'>{this.renderMenu()}</ul>
                </div>;
    },
    renderHeader(){
        let headerCls = Util.parseClassName('pure-menu-heading', this.props.titleLink && 'pure-menu-link');
        if(this.props.title){
            if(this.props.titleLink){
                return <a className={headerCls}>{this.props.title}</a>;
            }
            return <span className={headerCls}>{this.props.title}</span>;
        }
    },
    renderMenu(){
        if(this.state.data){
            return this.state.data.map(function(c, idx){
                let {children, ...props} = c;
                return <MenuItem {...props} subMenus={children} ref={MENU_ITEM_PREFIX + idx}
                            key={idx} onSelect={this.onMenuSelect}>
                        </MenuItem>;
            }.bind(this));
        }
    },
    onMenuSelect(hierarchy){
        Object.keys(this.refs).forEach(function(key){
            if(key.startsWith(MENU_ITEM_PREFIX)){
                this.refs[key].unSelect();
            }
        }.bind(this));
        hierarchy.forEach(function(item){
            item.select();
        });
        if(this.props.onSelectMenu){
            this.props.onSelectMenu(hierarchy);
        }
    }
});
module.exports = Menu;
