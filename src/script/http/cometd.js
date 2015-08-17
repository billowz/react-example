let org_cometd = require('org/cometd'),
  ajax = require('./ajax');
function _setHeaders(xhr, headers) {
  if (headers) {
    for (var headerName in headers) {
      if (headerName.toLowerCase() === 'content-type') {
        continue;
      }
      xhr.setRequestHeader(headerName, headers[headerName]);
    }
  }
}
function LongPollingTransport() {
  var _super = new org_cometd.LongPollingTransport();
  var that = org_cometd.Transport.derive(_super);

  that.xhrSend = function(packet) {
    return ajax({
      url: packet.url,
      async: packet.sync !== true,
      type: 'POST',
      contentType: 'application/json;charset=UTF-8',
      data: packet.body,
      xhrFields: {
        // Has no effect if the request is not cross domain
        // but if it is, allows cookies to be sent to the server
        withCredentials: true
      },
      beforeSend: function(xhr) {
        _setHeaders(xhr, packet.headers);
        // Returning false will abort the XHR send
        return true;
      },
      success: packet.onSuccess,
      error: function(xhr, reason, exception) {
        packet.onError(reason, exception);
      }
    });
  };
  return that;
}



function CallbackPollingTransport() {
  var _super = new org_cometd.CallbackPollingTransport();
  var that = org_cometd.Transport.derive(_super);
  that.jsonpSend = function(packet) {
    ajax({
      url: packet.url,
      async: packet.sync !== true,
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'jsonp',
      data: {
        // In callback-polling, the content must be sent via the 'message' parameter
        message: packet.body
      },
      beforeSend: function(xhr) {
        _setHeaders(xhr, packet.headers);
        // Returning false will abort the XHR send
        return true;
      },
      success: packet.onSuccess,
      error: function(xhr, reason, exception) {
        packet.onError(reason, exception);
      }
    });
  };
  return that;
}
module.exports = function(name, extensions) {
  var cometd = new org_cometd.Cometd(name);

  // Registration order is important
  if (org_cometd.WebSocket) {
    cometd.registerTransport('websocket', new org_cometd.WebSocketTransport());
  }
  cometd.registerTransport('long-polling', new LongPollingTransport());
  cometd.registerTransport('callback-polling', new CallbackPollingTransport());
  if (extensions) {
    extensions.forEach(function(ext) {
      cometd.registerExtension(ext.name, ext)
    });
  }
  return cometd;
};

