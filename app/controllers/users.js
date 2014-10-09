'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	ninjacrawler = require('../apis/ninjacrawler.js'),
	User = mongoose.model('User');
	
exports.logIn = function(req, res) {
	User.findOne({"id": req.param.userId}, function(err, user) {
		if (err) {
			return res.json(500, {
				error: err
			});
		}

		if (user) {
			// start crawling
			var crawler = new ninjacrawler({userId : user.id});
			crawler.fetchAll( function(err, result)  {
				crawler.mapData( function(err, result) {
					res.json({ token: user._id });
				});
			});
		} 
		else {
			var user = new User({ 
				id : '123',
				name : 'µCtrl tester',
				email : 'uctrl@outlook.com',
				ninjablocks: { userAccessToken: global.uctrl.ninja.userAccessToken }
			});
			user.save(function(err, user) {
				if (err) {
					return res.json(500, {
						error: err
					});
				}
				// start crawling
				var crawler = new ninjacrawler({userId : user.id});
				crawler.fetchAll( function(err, result)  {
					crawler.mapData( function(err, result) {
						res.json({ token: user._id });
					});
				});
			});
		}
	});
};

exports.create = function(req, res) {
	var user = new User(req.body);
	
	user.save(function(err) {
		if (err) {
			return res.json(500, {
				error: err//"Can't create the user"
			});
		}
		res.json(user);
	});
};