'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"} );

var UECONDITIONTYPE = {
    None : -1,
	Date : 1,
	Day : 2,
	Time : 3,
	Device : 4
};

var UECOMPARISONTYPE = {
    None : 0,
	GreaterThan : 0x1,
	LesserThan : 0x2,
	Equals : 0x4,
	InBetween : 0x8,
	Not : 0x16
};

exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules
	ninja.rules(function(err, data){
		res.json(data);
	});
};

exports.create = function(req, res) {
	ninja.rule().create(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot create the condition'
      		});
    	} 
		res.json(data);
	});
};

exports.update = function(req, res) {
	var conditionId = req.params["conditionId"];

	ninja.rule(conditionId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});
};


exports.destroy = function(req, res) {
	var conditionId = req.params["conditionId"];

	ninja.rule(conditionId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var conditionId = req.params["conditionId"];

	ninja.rule(conditionId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
};