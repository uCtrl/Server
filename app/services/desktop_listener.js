'use strict';

var _ = require('lodash'),
    async = require('async'),
    WebSocketServer = require('ws').Server,
    sockets = {};

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var Logs = mongoose.model('Log');
var UTask = mongoose.model('UTask');
var UPlatform = mongoose.model('UPlatform');
var UDevice = mongoose.model('UDevice');
var UScenario = mongoose.model('UScenario');
var UCondition = mongoose.model('UCondition');

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


var EAction = {
    none: 0,
    create : 1,
    update: 2, 
    delete: 3
};

var ETarget = {
    none: 0,
    platform : 1,
    device: 2, 
    scenario: 3,
    task: 4,
    condition: 5
};

function findParents(msg, level, item, callback) {
    async.waterfall([
        function findTask(cond, cb) {
            if (level > EAction.task) {
                var c = cond || item;
                UTask.findOne({_id: c._task}, function(err, t) {
                    if (err) return cb(err);

                    msg.taskId = t.id;
                    cb(null, t);
                })
            } else cb(null, null) // no results yet
        },
        function findScenario(task, cb) {
            if (level > EAction.scenario) {
                var t = task || item;
                UScenario.findOne({_id: t._scenario}, function(err, s) {
                    if (err) return cb(err);

                    msg.scenarioId = s.id;
                    cb(null, s);
                })
            } else cb(null, null) // no results yet
        },
        function findDevice(scenario, cb) {
            if (level > EAction.device) {
                var s = scenario || item;
                UDevice.findOne({_id: s._device}, function(err, d) {
                    if (err) return cb(err);

                    msg.deviceId = d.id;
                    cb(null, d);
                })
            } else cb(null, null) // no results yet
        },
        function findPlatform(device, cb) {
            if (level > EAction.platform) {
                var d = device || item;
                UPlatform.findOne({_id: d._platform}, function(err, p) {
                    if (err) return cb(err);

                    msg.platformId = p.id;
                    cb(null, p);
                })
            } else cb(null, null) // no results yet
        }], 
        function(err, result) {
            if (err) console.log("error finding parents");
            callback(err, msg);
        }
    );
};

function dealWithEvent(user, target, action, item) {
    var token = user.ninjablocks.userAccessToken;
    var msg = {
        target: target,
        action: action,
        item: item
    };
    findParents(msg, target - 1, item, function(err, msg) {
        sendUser(token, msg);
    });
}

function sendUser(token, msg) {
    _.forEach(_.find(sockets, {token: token}), function (a) {
        _.forEach(a, function (s) {
            s.send(msg, function (err) {
                if (err) {
                    console.log ("Remote socket disconnected. Should flush it.");

                }
            });
        });
    });
}

UPlatform.on('update', function (user, item) {
    dealWithEvent(user, ETarget.platform, EAction.update, item);
});
UPlatform.on('create', function (user, item) {
    dealWithEvent(user, ETarget.platform, EAction.create, item);
});
UPlatform.on('delete', function (user, item) {
    dealWithEvent(user, ETarget.platform, EAction.delete, item);
});

UDevice.on('update', function (user, item) {
    dealWithEvent(user, ETarget.device, EAction.update, item);
});
UDevice.on('create', function (user, item) {
    dealWithEvent(user, ETarget.device, EAction.create, item);
});
UDevice.on('delete', function (user, item) {
    dealWithEvent(user, ETarget.device, EAction.delete, item);
});

UScenario.on('update', function (user, item) {
    dealWithEvent(user, ETarget.scenario, EAction.update, item);
});
UScenario.on('create', function (user, item) {
    dealWithEvent(user, ETarget.scenario, EAction.create, item);
});
UScenario.on('delete', function (user, item) {
    dealWithEvent(user, ETarget.scenario, EAction.delete, item);
});

UTask.on('update', function (user, item) {
    dealWithEvent(user, ETarget.task, EAction.update, item);
});
UTask.on('create', function (user, item) {
    dealWithEvent(user, ETarget.task, EAction.create, item);
});
UTask.on('delete', function (user, item) {
    dealWithEvent(user, ETarget.task, EAction.delete, item);
});

UCondition.on('update', function (user, item) {
    dealWithEvent(user, ETarget.condition, EAction.update, item);
});
UCondition.on('create', function (user, item) {
    dealWithEvent(user, ETarget.condition, EAction.create, item);
});
UCondition.on('delete', function (user, item) {
    dealWithEvent(user, ETarget.condition, EAction.delete, item);
});