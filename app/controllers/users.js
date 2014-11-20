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

	function createUser(userAccessToken, cb) {
		var nb = new ninjablocks({userAccessToken : userAccessToken});
		nb.user( function(err, ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.json(500, {
							status: false,
							error: err
						});
					}
					User.emit('create', user);
					if (cb) cb(user, userAccessToken);
				});
			});
		});
	}

	function updateUser(user) {
		//TODO: Update values of user from NB. 
		//AND DO NOT REFETCH ALL : this will change all ids
		res.json({
			status: false,
			error: 'Update fonction need to be implemented',
			token: user._id
		});	
	}

	function doSomethingWithUser(u, token) {
		// Start Ninja Blocks crawling
		new ninjacrawler({ user: u, userAccessToken: token }).fetchAll( function(err, result) {
			console.log("--NinjaCrawler : done 'fetchAll'");
			
			res.json({
				status: true,
				error: null,
				token: u._id
			});
		});	
	}

	User.findOne({ 'ninjablocks.userAccessToken': userAccessToken }).exec(function(err, user) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err
			});
		}
		user ? updateUser(user) : createUser(userAccessToken, doSomethingWithUser);
	});
};