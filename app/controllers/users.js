'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	ninjablocks = require('../apis/ninjablocks.js'),
	User = mongoose.model('User');
	
exports.logIn = function(req, res) {
};

exports.create = function(req, res) {
	var userAccessToken = req.body.userAccessToken;
	
	if (userAccessToken != undefined) {
		var nb = new ninjablocks({userAccessToken : userAccessToken});
		nb.user( function(err, ninjaUser) {
			if (err) {
				return res.json(500, {
					error: err //"Can't create the user"
				});
			}
			
			User.fromNinjaBlocks(ninjaUser, ninjaUser.id, userAccessToken, function(user) {
				user.save(function(err) {
					if (err) {
						return res.json(500, {
							error: err //"Can't create the user"
						});
					}
					
					User.emit('create', user);
					res.json({ token: user._id });
				});
			});
		});	
	}
	else {
		return res.json(500, {
			error: "Please provide a valid userAccessToken." //"Can't create the user"
		});
	}
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
			var crawler = new ninjacrawler({userAccessToken : user.ninjablocks.userAccessToken});
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
			var crawler = new ninjacrawler({userAccessToken : user.ninjablocks.userAccessToken});
			crawler.pushAll( function(err, result)  {
				res.json("Completed");
			});
		} 
	});
};