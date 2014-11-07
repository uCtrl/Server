'use strict';

var _ = require('lodash'),
WebSocketServer = require('ws').Server,
sockets = {};

var mongoose = require('mongoose'),
Stats = mongoose.model('Stats');

module.exports = function(app, server) {

    var wss = new WebSocketServer({
        server: server,
        path: '/stream'
    });

    function addSocket (token, s) {
        var a = sockets[token] || [];

        if (!_.contains(a, s)) {
            a.push(s);
        }
        sockets[token] = a;
    }

    wss.on('connection', function(ws) {
        console.log("User connected.");
        
        ws.on('message', function(message) {
            if (message.token) {
                addSocket(message.token, ws);
            }
        });

        ws.send('Hello there.');
    });
} 


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