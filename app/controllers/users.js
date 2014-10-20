'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	User = mongoose.model('User');
	
exports.logIn = function(req, res) {
};

exports.create = function(req, res) {
	var userAccessToken = req.param.userAccessToken;
	
	if (userAccessToken != undefined) {
		//TODO : ceci est pour test seulement
		User.createDefault( function(user) {
			user.save(function(err) {
				if (err) {
					return res.json(500, {
						error: err //"Can't create the user"
					});
				}
				res.json({ token: user._id });
			});
		});
	}
	else {
		var nb = new ninjablocks({userAccessToken : userAccessToken});
		nb.user( function(ninjaUser) {
			User.fromNinjaBlocks(ninjaUser, ninjaUser.id, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.json(500, {
							error: err //"Can't create the user"
						});
					}
					res.json({ token: user._id });
				});
			});
		});
	}
};

exports.fetchAll = function(req, res) {
	var userId = req.param.userId;
	
	User.findById(userId, function(err, user) {
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
	var userId = req.param.userId;
	
	User.findById(userId, function(err, user) {
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