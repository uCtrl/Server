'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjablocks = require('../apis/ninjablocks.js'),
	User = mongoose.model('User');

exports.all = function(req, res) {
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

exports.update = function(req, res) {
	var userId = req.params.userId;

	User.findOneAndUpdate(
		{ id: userId }, 
		req.body,
		function (err, user) {
			if (err) {
				return res.json(500, {
					status: false,
					error: err//"Can't update user " + userId
				});
			}
			
			User.emit('update', user);
			res.json({
				status: true,
				error: null,
				user: user
			});
		}
	);
};

exports.destroy = function(req, res) {
	var userId = req.params.userId;

	User.findOne({ id: userId }, function(err, user) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't update user " + userId
			});
		}
		
		User.emit('destroy', user);
		res.json({
			status: true,
			error: null,
			user: user.remove()
		});
	});
};

exports.show = function(req, res) {
	var userId = req.params.userId;

	User.findOne({ id: userId }, function(err, user) {
	    if (err) {
			return res.json(500, {
				status: false,
				error: err//"Can't update user " + userId
			});
		}
		
		User.emit('show', user);
	    res.json({
			status: true,
			error: null,
			user: user
		});
	});
};