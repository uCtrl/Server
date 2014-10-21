'use strict';

var _ = require('lodash'),
WebSocketServer = require('ws').Server,
wss = new WebSocketServer({port: 3001}),
sockets = {};


wss.on('connection', function(ws) {
  console.log("User connected.");
  ws.on('message', function(message) {
    var data = JSON.parse(message);
    if (data.token) {
      addSocket(data.token, ws);
    }
  });
  ws.send('Hello there.');
});


function addSocket (token, s) {
  var a = sockets[token] || [];

  if (!_.contains(a, s)) {
    a.push(s);
  }
  sockets[token] = a;
}


var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

Stats.on('create', function(stat) {

  // Tell everyone about the new stat
  _.forEach(sockets, function (a) {
    _.forEach(a, function (s) {
      var msg = {
        type: 'stat',
        target: stat.id,
        data: stat
      };

      s.send(msg, function (err) {
        if (err) {
          console.log ("Remote socket disconnected. Should flush it.");
        }
      });
    });
  });
});