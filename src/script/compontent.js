let React = require('react'),
    comps = {};
let Compontent = function(name, option){
    if(comps[name]){
        throw new Error('Compontent named[${name}] is defined.');
    }
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
module.exports = Compontent;
