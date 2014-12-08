'use strict';

var mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	recommendationsFinder = require('../apis/recommendationsFinder.js'),
	pusher = require('../controllers/pusher/ninja_pusher.js'),
	User = mongoose.model('User');

exports.create = function (req, res) {
	if (!req.body.ninjablocks)
		return;

	var userAccessToken = req.body.ninjablocks.userAccessToken;

	if (!userAccessToken)
		return;

	function createUser(userAccessToken) {
		var nb = new ninjablocks({userAccessToken: userAccessToken});
		nb.user(function (err, ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, userAccessToken, function (user) {
				user.save(function (err) {
					if (err) {
						return res.status(500).json({
							status: false,
							error: err
						});
					}
					User.emit('create', user);
					startCrawler(user, userAccessToken);
					pusher.startPusher(user);
				});
			});
		});
	}

	function updateUser(user) {
		//TODO: Update values of user from NB

		// Refetch recommendations
		recommendationsFinder.start(user);

		res.json({
			status: true,
			error: null,
			token: user._id
		});
	}

	function startCrawler(user) {
		// Start Ninja Blocks crawling
		new ninjacrawler({ user: user, userAccessToken: user.ninjablocks.userAccessToken }).fetchAll(function () {
			console.log('--NinjaCrawler : done \'fetchAll\'');

			recommendationsFinder.start(user);
		});

		return res.json({
			status: true,
			error: null,
			token: user._id
		});
	}

	User.findOne({ 'ninjablocks.userAccessToken': userAccessToken }).exec(function (err, user) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		user ? updateUser(user) : createUser(userAccessToken);
	});
};