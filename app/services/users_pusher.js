'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	pusher = require('../controllers/pusher/ninja_pusher.js');

module.exports = function () {
	User.find().exec(function (err, users) {
		_.forEach(users, function (user) {
			pusher.startPusher(user);
		});
	});
};