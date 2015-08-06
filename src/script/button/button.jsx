let {PropTypes} = require('react'),
    Compontent = require('../compontent'),
    Util = require('../util/util');

let Button = Compontent('Button', {
    propTypes:{
        active: PropTypes.bool,
        disabled: PropTypes.bool,
        primary: PropTypes.bool,
        iconCls: PropTypes.string
    },
    getDefaultProps() {
        return {
            active: false,
            disabled: false,
            primary: false
        }
    },
    render() {
        let { className, href, active, disabled, primary, iconCls, ...props} = this.props,
            cls = Util.parseClassName('pure-button', className,
            active && 'pure-button-active',
            disabled && 'pure-button-disabled',
            primary && 'pure-button-primary'
        );
        iconCls = Util.parseIconClassName(iconCls);
        let icon = <i key='button-icon' className={iconCls}/>,
            content = [<span key='button-text'>{this.props.text}</span>];
        if(iconCls.length>0){
            content.splice(0, 0, icon);
        }

        if(href){
            return (<a href = {href} className = {cls} {...props}>{content}</a>);
        }else{
            return (<button className = {cls} disabled = {disabled} {...props}>{content}</button>);
        }
    }
});
module.exports = Button;
