'use strict';

var mongoose = require('mongoose');
var Recommendations = mongoose.model('Recommendations');

exports.read = function(req, res) {
	Recommendations.find().sort('id').exec(function(err, recommendations) {
		if (err) {
			return res.json(500, {
				status: false,
				error: err
			});
	    }
		
		res.json({
			status: true,
			error: null,
			recommendations: recommendations
		});
	});
}

exports.accept = function(req, res) {
	var recommendation = res.body;
	if (!recommendation.accepted) {
		return res.json({
			status: true,
			error: null
		});
	}

	// Create the DAM scenario + task + condition based on values
};
