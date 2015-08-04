let React = require('react'),
    {PropTypes} = React,
    comps = {};
let Compontent = function(name, option){
    if(comps[name]){
        throw new Error('Compontent named[${name}] is defined.');
    }
    option.displayName = name;
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
    dom = (<Comp  {...props} compontents={cfg.children}></Comp>);
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
            useKey = key +'-'+idx;
        }else{
            useKey = idx;
        }
    }
    return useKey;
}
Compontent.Mixins = {
    propTypes:{
        compontents: PropTypes.array
    },
    renderCompontent(cfgs, key, handler){
        if(typeof key === 'function'){
            handler = key;
            key = null;
        }
        if(Array.isArray(cfgs)){
            return cfgs.filter(function(cfg){
                return typeof cfg === 'object';
            }).map(function(cfg, idx){
                return _parseCompontent(cfg, _parseKey(key, idx), idx, handler);
            }.bind(this));
        }else if(typeof cfgs === 'object'){
            return Object.keys(cfgs).filter(function(idx){
                return typeof cfgs[idx] === 'object';
            }).map(function(idx){
                return _parseCompontent(cfg[key], _parseKey(key, idx), idx, handler);
            });
            return _parseCompontent(cfg, key, 0, handler);
        }else{
            throw new Error('Invalid param 0, need object or array', cfg);
        }
    }
}
module.exports = Compontent;
