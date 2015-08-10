let React = require('react'),
    watch = require("./watch/watch"),
    DataPovider = require('./data/povider'),
    {PropTypes} = React,
    comps = {};
let Compontent = function(name, option){
    if(comps[name]){
        throw new Error('Compontent named[${name}] is defined.');
    }
    option.displayName = name;
    option.getCompontentName = function(){return name;};
    option.mixins = [Compontent.Mixins].concat(option.mixins||[]);
    comps[name] = React.createClass(option);
    return comps[name];
}
Compontent.getCompontent = function(name){
    return comps[name];
}
Compontent.getCompontentNames = function(reg){
    if(reg){
        reg = new RegExp(reg);
    }
    let names = [];
    for(let name in comps){
        if(comps.hasOwnProperty(name) && comps[name]){
            if(reg && !reg.test(name)){
                continue;
            }
            names.push(name);
        }
    }
    return names;
}

function _parseCompontent(cfg, key, idx, handler){
    let Comp = cfg.type, dom, fdom,
        props = cfg.option || {};
    if(typeof Comp === 'string'){
        Comp = Compontent.getCompontent(cfg.type);
    }
    if(key){
        props.key = key;
    }
    dom = (<Comp {...props} compontents={cfg.children} dataPovider={cfg.dataPovider}></Comp>);
    if(typeof handler === 'function'){
        fdom = handler.apply(this, [cfg, dom, idx]);
        if(fdom!=undefined){
            dom = fdom;
        }
    }
    return dom;
}
function _parseKey(key, idx){
    let useKey = false;
    if(key){
        if(typeof key === 'string'){
            if(idx)
                useKey = key +'-'+idx;
            else
                useKey = key;
        }else{
            useKey = idx;
        }
    }
    return useKey;
}
Compontent.renderCompontent = function(cfg, key, handler){
    return _parseCompontent(cfg, _parseKey(key, 0), 0, handler);
}
Compontent.renderCompontents = function renderCompontents(cfgs, key, handler){
     if(typeof key === 'function'){
        handler = key;
        key = null;
    }
    if(Array.isArray(cfgs)){
        return cfgs.filter(function(cfg){
            return typeof cfg === 'object';
        }).map(function(cfg, idx){
            return _parseCompontent(cfg, _parseKey(key, idx), idx, handler);
        });
    }else if(typeof cfgs === 'object'){
        return Object.keys(cfgs).filter(function(idx){
            return typeof cfgs[idx] === 'object';
        }).map(function(idx){
            return _parseCompontent(cfg[key], _parseKey(key, idx), idx, handler);
        });
    }else{
        throw new Error('Invalid param 0, need object or array', cfg);
    }
}
Compontent.Mixins = {
    propTypes:{
        compontents: PropTypes.array,
        dataPovider: PropTypes.instanceOf(DataPovider)
    },
    getInitialState(){
        if(this.props.dataPovider){
            this.props.dataPovider.subscribe(function(data){
                this.setState({
                    data:data
                });
            }.bind(this), function(updated){

            }.bind(this), function(){
                this.console.error(arrguments);
            });
        }
        return {
            data:null
        };
    },
    componentWillUnmount(){
        //this.__unwatchCompontents();
    },
    __watchCompontents(){
        let self = this;
        if(!this.__compontentsWatchHandler){
            this.__compontentsWatchHandler = function(prop, func, val, oldVal){
                console.log(self.getCompontentName(), self, this, arguments);
                self.forceUpdate();
            }
        }else{
            this.__unwatchCompontents();
        }
        watch.watch(this.props, 'compontents', this.__compontentsWatchHandler);
    },
    __unwatchCompontents(){
        if(this.__compontentsWatchHandler){
            watch.unwatch(this.props, 'compontents', this.__compontentsWatchHandler);
        }
    },
    renderCompontents(key){
        // reset this.props.compontents
        // change compontents
        //this.__watchCompontents();
        return Compontent.renderCompontents(this.props.compontents, key, this.compontentHandler);
    }
}
module.exports = Compontent;
