'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	User = mongoose.model('User');
	
exports.create = function(req, res) {
	console.log(req.body);
	
	if (!req.body.ninjablocks) 
		return;

	var userAccessToken = req.body.ninjablocks.userAccessToken;
	
	if (!userAccessToken) 
		return;

	function createUser(userAccessToken, cb) {
		var nb = new ninjablocks({userAccessToken : userAccessToken});
		console.log(userAccessToken);
		nb.user( function(err, ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.json(500, {
							status: false,
							error: err
						});
					}

					if (cb) cb(user, userAccessToken);
				});
			});
		});
	}

	function updateUser(user, cb) {
		// TODO: Update values of user from NB
		if (cb) cb(user); 
	}

	function doSomethingWithUser(u, token) {
		// Start Ninja Blocks crawling
		new ninjacrawler({ userId : u._id, userAccessToken: token }).fetchAll( function(err, result) {
			console.log("done 'fetchAll'");
		});

		console.log("new ninjacrawler instanciated");

		User.emit('create', req.uCtrl_User, u);
		
		res.json({
			status: true,
			error: null,
			token: u._id
		});		
	}

	User.findOne({ 'ninjablocks.userAccessToken': userAccessToken }).exec(function(err, user) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err
			});
		}
		console.log("user : " + user);
		user ? updateUser(user, doSomethingWithUser) : createUser(userAccessToken, doSomethingWithUser);
	});
};