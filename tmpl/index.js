module.exports = {<%for(var i=0; i<modules.length; i++){%>
    <%=modules[i].name%>: require('<%=modules[i].relativePath%>')<%=i<modules.length-1?',':''%><%}%>
};
