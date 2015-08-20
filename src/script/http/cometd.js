let Cometd = require('cometd-cjs'),
  ajax = require('reqwest');
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
  var _super = new Cometd.LongPollingTransport();
  var that = Cometd.Transport.derive(_super);

  that.xhrSend = function(packet) {
    return ajax({
      url: packet.url,
      method: 'POST',
      type: 'json',
      contentType: 'application/json;charset=UTF-8',
      data: packet.body,
      withCredentials: true,
      headers: packet.headers,
      success: packet.onSuccess,
      error: function(xhr) {
        packet.onError(xhr.statusText, xhr.response);
      }
    });
  };
  return that;
}



function CallbackPollingTransport() {
  var _super = new Cometd.CallbackPollingTransport();
  var that = Cometd.Transport.derive(_super);
  that.jsonpSend = function(packet) {
    return ajax({
      url: packet.url,
      method: 'POST',
      type: 'jsonp',
      data: {
        message: packet.body
      },
      headers: packet.headers,
      success: packet.onSuccess,
      error: function(xhr) {
        packet.onError(xhr.statusText, xhr.response);
      }
    });
  };
  return that;
}
module.exports = function(name, extensions) {
  var cometd = new Cometd.CometD(name);
  extensions = extensions ? is.array(extensions) ? extensions : [extensions] : [];
  // Registration order is important
  if (Cometd.WebSocket) {
    cometd.registerTransport('websocket', new Cometd.WebSocketTransport());
  }
  cometd.registerTransport('long-polling', new LongPollingTransport());
  cometd.registerTransport('callback-polling', new CallbackPollingTransport());
  extensions.forEach(function(ext) {
    cometd.registerExtension(ext.name, ext)
  });
  return cometd;
};

