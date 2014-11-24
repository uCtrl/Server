'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	uuid = require('node-uuid'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	User = mongoose.model('User');
	
exports.create = function(req, res) {
	if (!req.body.ninjablocks) 
		return;

	var userAccessToken = req.body.ninjablocks.userAccessToken;
	
	if (!userAccessToken) 
		return;

	function createUser(userAccessToken) {
		var nb = new ninjablocks({userAccessToken : userAccessToken});
		nb.user( function(err, ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.status(500).json({
							status: false,
							error: err
						});
					}
					User.emit('create', user);
					startCrawler(user, userAccessToken)
				});
			});
		});
	}

	function updateUser(user) {
		//TODO: Update values of user from NB
		res.json({
			status: true,
			error: null,
			token: user._id
		});	
	}

	function startCrawler(user) {
		// Start Ninja Blocks crawling
		new ninjacrawler({ user: user, userAccessToken: user.ninjablocks.userAccessToken }).fetchAll( function(err, result) {
			console.log("--NinjaCrawler : done 'fetchAll'");
		});	

		return res.json({
			status: true,
			error: null,
			token: user._id
		});
	}

	User.findOne({ 'ninjablocks.userAccessToken': userAccessToken }).exec(function(err, user) {
		if (err) {
			return res.status(500).json({
				status: false,
				error: err
			});
		}
		user ? updateUser(user) : createUser(userAccessToken);
	});
};