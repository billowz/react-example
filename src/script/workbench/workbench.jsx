let Compontent = require('../compontent');
let Workbench = Compontent('Workbench', {
    displayName: 'Workbench',
    render() {
        let Button = Compontent.getCompontent('Button');
        console.log(Button)
        return ( < div >
            < Button active={true}> 123 < /Button> < /div > );
    }
});
module.exports = Workbench;
