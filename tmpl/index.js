<%if(!path){%>
/**!
 * React UI
 * the UI Compontent on React
 *
 * @copyright 2015 tao.zeng
 * @license MIT
 */<%}else{%>
/**!
 * React UI Module:<%=path%>
 */<%}%>

module.exports = {<%for(var i=0; i<modules.length; i++){%>
  <%=modules[i].name%>: require('<%=modules[i].relativePath%>')<%=i<modules.length-1?',':''%><%}%>
};
