'use strict';
var Pusher = require('pusher-client');

exports.startPusher = function (user) {
	console.log('Starting Pusher monitor for user ' + user.name);

	var pusher = new Pusher('ccff70362850caf79c9f');
	var channel = pusher.subscribe('0511a894f99712072bebefe21be4bf971c24888d');

	// SUBSCRIPTION
	channel.bind('pusher:subscription_succeeded', function () {
	});

	// DATA
	var dataController = require('./data.js');
	channel.bind('data', dataController.save(user));

	// CONFIG - Seems to be sent when playing around in the interface without applying new rules
	channel.bind('config', function () {
		console.log('New CONFIG.');
	});

	// STREAM
	var streamController = require('./stream.js');
	channel.bind('stream', streamController.save(user));

	channel.bind('heartbeat', function (data) {
		console.log('HEARTBEAT ', data);
	});
};
