'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	User = mongoose.model('User');
	
exports.logIn = function(req, res) {
	var crawler = new ninjacrawler({userId : req.params.userID});
	crawler.fetchAll( function(err, result)  {
		crawler.mapData( function(err, result) {
			res.json(result);
		});
	});
};

/*
exports.logIn = function(req, res) {
	var ninjablocks = req.body.ninjablocks;
	if (!ninjablocks || !ninjablocks.userAccessToken) {
		return res.json(500, {
			error: "No ninjablocks token provided"
		});
	}

	User.findOne({"ninjablocks.userAccessToken": ninjablocks.userAccessToken}, function(err, user) {
		if (err) {
			return res.json(500, {
				error: err
			});
		}

		if (user) {
			// RAISE EVENT TO START CRAWLING
			res.json({ token: user._id });
		} else {
			var user = new User({ ninjablocks: { userAccessToken: ninjablocks.userAccessToken }});
			user.save(function(err, user) {
				if (err) {
					return res.json(500, {
						error: err
					});
				}
				// RAISE EVENT TO START CRAWLING
				res.json({ token: user._id });
			});
		}
	});
};
*/