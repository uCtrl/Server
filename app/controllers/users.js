'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
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
		nb.user( function(ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.json(500, {
							status: false,
							error: err
						});
					}
					return user;
				});
			});
		});
	}

	function updateUser(user) {
		// TODO: Update values of user from NB
		return user;
	}

	User.findOne({ 'ninjablocks.userAccessToken': userAccessToken }).exec(function(err, user) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err
			});
		}

		user = user ? updateUser(user) : createUser(userAccessToken);

		// Start Ninja Blocks crawling
		new ninjacrawler({ userId : user._id }).fetchAll( function(err, result)  { } );

		res.json({
			status: true,
			error: null,
			token: user._id
		});		
	});
};

exports.fetchAll = function(req, res) {
	var token = req.params.token;

	User.findById(token, function(err, user) {
		if (err) {
			return res.json(500, {
				error: err
			});
		}
		if (user) {
			var crawler = new ninjacrawler({userId : user._id});
			crawler.fetchAll( function(err, result)  {
				res.json("Completed");
			});
		}
	});
};

exports.pushAll = function(req, res) {
	var token = req.params.token;
	
	User.findById(token, function(err, user) {
		if (err) {
			return res.json(500, {
				error: err
			});
		}
		if (user) {
			var crawler = new ninjacrawler({userId : user._id});
			crawler.pushAll( function(err, result)  {
				res.json("Completed");
			});
		} 
	});
};