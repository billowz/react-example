let Compontent = require('../compontent');
let Workbench = Compontent('Workbench', {
  displayName: 'Workbench',
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

    return ( <div>
        {
            comps.map(function(cfg, idx){
                var Comp = Compontent.getCompontent(cfg.type);
                return (<Comp key={idx} {...cfg.option}/>);
            })
        }
        </div> );
  }
});
module.exports = Workbench;
