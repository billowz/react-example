let _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];
function _arrayEmptyFilter(v){
    return v;
}
module.exports = {
    arrayEmptyFilter: _arrayEmptyFilter,
    parseClassName: function parseClassName(classNames) {
        if (!classNames) {
            return '';
        }
        if (Array.isArray(classNames)) {
            return classNames.join(' ');
        } else if (typeof classNames === 'object') {
            return Object.keys(classNames).filter(function(className) {
                return classNames[className];
            }).join(' ');
        } else {
            return Array.prototype.filter.call(arguments, _arrayEmptyFilter).join(' ');
        }
    },
    parseIconClassName: function parseIconClassName(iconCls) {
        let iconClasses,
            isFa = false,
            i;
        if(!iconCls){
            return '';
        }
        if (typeof iconCls === 'string') {
            iconClasses = iconCls ? iconCls.split(/\s+/g) : []
        } else if (Array.isArray(iconCls)) {
            iconClasses = iconCls;
        } else if (typeof iconCls === 'object') {
            iconClasses = Object.keys(classNames).filter(function(className) {
                return classNames[className];
            });
        } else {
            throw new Error('Invalid param', arguments);
        }
        for (i = 0; i < iconClasses.length; i++) {
            if (iconClasses[i].startsWith('fa-')) {
                isFa = true;
            }
        }
        if (isFa && iconClasses.indexOf('fa') === -1) {
            iconClasses.splice(0, 0, 'fa');
        }
        return iconClasses.join(' ');
    },
    objectWithoutProperties: function(){
        _objectWithoutProperties.apply(this, arguments);
    }
}
