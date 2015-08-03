module.exports = {<%for(var i=0; i<modules.length; i++){%>
    <%=modules[i].name%>: require('<%=modules[i].path%>')<%=i<modules.length-1?',':''%><%}%>
};
