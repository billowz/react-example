let {PropTypes} = require('react'),
    Compontent = require('../compontent');

let Menu = Compontent('Menu', {
    propTypes : {
        horizontal: PropTypes.bool,
        scrollable: PropTypes.bool
    },
    getDefaultProps(){
        return {
            horizontal: false,
            scrollable: false
        }
    },
    render() {
        const { className, horizontal, scrollable, ...props } = this.props;
        const cls = classNames(
            'pure-menu', className,
            horizontal && 'pure-menu-horizontal',
            scrollable && 'pure-menu-scrollable'
        );
        return <div className={cls} {...props}></div>;
    }
});
module.exports = Menu;
