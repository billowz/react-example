let Compontent = require('../compontent');
let Workbench = Compontent('Workbench', {
  render() {
    var comps = [];
    for(var i=0; i<1000; i++){
        comps.push({
            type:'Button',
            option:{
                text:'Test'+i,
                active:i%3==0,
                disabled:i%3==1,
                primary:i%3==2
            }
        })
    }

    var Grid = {
        type:'GridLayout',
        children:comps,
        option:{
            size: function(cfg, idx){
                if(idx%2==0){
                    return '2-5';
                }
                return '1-5';
            }
        }
    }
    return this.renderCompontent([Grid]);
  }
});
module.exports = Workbench;
