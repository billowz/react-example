let {PropTypes} = require('react'),
    Compontent = require('../compontent'),
    Util = require('../util/util');

let Menu = Compontent('Menu', {
    propTypes : {
        horizontal: PropTypes.bool,
        scrollable: PropTypes.bool
    },
    getDefaultProps(){
        return {
            horizontal: true,
            scrollable: false
        }
    },
    render() {
        const { className, horizontal, scrollable, title, titleLink,...props } = this.props;
        const cls = Util.parseClassName(
            'pure-menu', className,
            horizontal && 'pure-menu-horizontal',
            scrollable && 'pure-menu-scrollable'
        );
        let headerCls = Util.parseClassName(
                'pure-menu-heading',
                titleLink && 'pure-menu-link'
            ),
            header = title ? titleLink ? <a className={headerCls}>{title}</a> : <span className={headerCls}>{title}</span> : null;

        return <div className={cls} {...props}>
                    {header}
                    <ul className='pure-menu-list'>
                         <li className='pure-menu-item pure-menu-has-children pure-menu-allow-hover' ><a href='#' className='pure-menu-link'>Flickr
                         <ul className="pure-menu-children">
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">Email</a></li>
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">Twitter</a></li>
                            <li className="pure-menu-item"><a href="#" className="pure-menu-link">Tumblr Blog</a></li>
                        </ul></a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Messenger</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Sports</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Finance</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Games</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>News</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>OMG!</a></li>
                    </ul>
                    <ul className='pure-menu-list'>
                         <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Flickr</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Messenger</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Sports</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Finance</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>Games</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>News</a></li>
                        <li className='pure-menu-item'><a href='#' className='pure-menu-link'>OMG!</a></li>
                    </ul>
                </div>;
    }
});
module.exports = Menu;
