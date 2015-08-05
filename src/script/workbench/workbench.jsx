let Compontent = require('../compontent');
let Workbench = Compontent('Workbench', {
    getDefaultProps(){
        var comps = [];
        for(var i=0; i<100; i++){
            comps.push({
                type:'GridLayout',
                option:{
                    size:'1-2'
                },
                children:[{
                    type:'Button',
                    option:{
                    text:'Test'+i,
                    active:i%3==0,
                    disabled:i%3==1,
                    primary:i%3==2
                    }
                },{
                    type:'Button',
                    option:{
                    text:'Test'+i,
                    active:i%3==0,
                    disabled:i%3==1,
                    primary:i%3==2
                    }
                }]
            })
        }
        var config = {
            type:'GridLayout',
            children:comps,
            option:{
                size: function(cfg, idx){
                    if(idx%2==0){
                        return '8-24';
                    }
                    return '4-24';
                }
            }
        }
        return {
            compontents:[config]
        }
    },
    render() {
        window.Workbench = this;
        return <div>{this.renderCompontents('main')}</div>
    }
});
module.exports = Workbench;
