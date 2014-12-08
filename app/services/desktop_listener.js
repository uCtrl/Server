'use strict';

var _ = require('lodash'),
	async = require('async'),
	WebSocketServer = require('ws').Server,
	uuid = require('node-uuid'),
	sockets = {},
	mongoose = require('mongoose');

var UTask = mongoose.model('UTask'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UCondition = mongoose.model('UCondition');

module.exports = function (app, server) {

	var wss = new WebSocketServer({
		server: server,
		path: '/stream'
	});

	function addSocket(token, s) {
		var a = sockets[token] || [];
		if (!s.id) {
			s.id = uuid.v1();
			a.push(s);
			sockets[token] = a;
		}
	}

	wss.on('connection', function (ws) {
		console.log('User connected.');

		ws.on('message', function (message) {
			message = JSON.parse(message);
			if (message.token) {
				addSocket(message.token, ws);
			}
		});
	});
};

var EAction = {
	none: 0,
	create: 1,
	update: 2,
	delete: 3
};

var ETarget = {
	none: 0,
	platform: 1,
	device: 2,
	scenario: 3,
	task: 4,
	condition: 5
};

function findParents(msg, level, item, callback) {
	async.waterfall([
			function findTask(cb) {
				if (level >= ETarget.task) {
					UTask.findOne({_id: item._task}, function (err, t) {
						if (err) return cb(err);
						msg.taskId = t.id;
						cb(null, t);
					});
				} else cb(null, null); // no results yet
			},
			function findScenario(task, cb) {
				if (level >= ETarget.scenario) {
					var t = task || item;
					UScenario.findOne({_id: t._scenario}, function (err, s) {
						if (err) return cb(err);
						msg.scenarioId = s.id;
						cb(null, s);
					});
				} else cb(null, null); // no results yet
			},
			function findDevice(scenario, cb) {
				if (level >= ETarget.device) {
					var s = scenario || item;
					UDevice.findOne({_id: s._device}, function (err, d) {
						if (err) return cb(err);
						msg.deviceId = d.id;
						cb(null, d);
					});
				} else cb(null, null); // no results yet
			},
			function findPlatform(device, cb) {
				if (level >= ETarget.platform) {
					var d = device || item;
					UPlatform.findOne({_id: d._platform}, function (err, p) {
						if (err) return cb(err);
						msg.platformId = p.id;
						cb(null, p);
					});
				} else cb(null, null); // no results yet
			}],
		function (err) {
			if (err) console.log('error finding parents');
			else callback(err, msg);
		}
	);
}

function sendUser(token, msg) {
	_.forEach(sockets[token], function (s) {
		s.send(JSON.stringify(msg), function (err) {
			if (err) {
				sockets[token] = _.filter(sockets[token], function (socket) {
					return socket.id !== s.id;
				});
			}
		});
	});
}

function dealWithEvent(user, target, action, item) {
	var token = user._id;
	var msg = {
		target: target,
		action: action,
		item: item
	};
	var k = _.keys(ETarget)[target] + 'Id';
	msg[k] = item.id;

	findParents(msg, target - 1, item, function (err, m) {
		sendUser(token, m);
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