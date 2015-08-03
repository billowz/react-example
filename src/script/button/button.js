let {PropTypes} = require('react'),
    Compontent = require('../compontent'),
    Util = require('../util');

let Button = Compontent('Button', {
    displayName: 'Button',
    propTypes:{
        active: PropTypes.bool,
        disabled: PropTypes.bool,
        primary: PropTypes.bool
    },
    getDefaultProps() {
        return {
            active: false,
            disabled: false,
            primary: false
        }
    },
    render() {
        const { className, href, active, disabled, primary, ...props} = this.props,
            cls = Util.parseClassName('pure-button', className,
                active && 'pure-button-active',
                disabled && 'pure-button-disabled',
                primary && 'pure-button-primary'
            );
        if(href){
            return (<a key='link-button' href = {href} className = {cls} {...props}>{this.props.text}</a>);
        }else{
            return (<button key='button' className = {cls} disabled = {disabled} {...props}>{this.props.text}</button>);
        }
    }
});
module.exports = Button;
