let Compontent = require('../compontent'),
    Util = require('../util/util');
let Workbench = Compontent('Workbench', {
    render() {
        let cls = Util.parseClassName('workbench', this.props.className);
        return <div className={cls}>{this.renderCompontents('main')}</div>
    }
});
module.exports = Workbench;
