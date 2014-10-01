'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var ucondition = mongoose.model('UCondition');

exports.all = function (req, res) {
	ucondition.all(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rules(function(err, data){
		res.json(data);
	});
	
	*/
};

exports.create = function(req, res) {
	ucondition.create(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rule().create(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot create the condition'
      		});
    	} 
		res.json(data);
	});
	*/
};

exports.update = function(req, res) {
	ucondition.update(req, function(data){
		res.json(data);
	});

	/*
	ninja.rule(conditionId).update(req.body, function(err, data){
		if (err) {
      		return res.json(500, {
       			error: 'Cannot update the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});
	*/
};


exports.destroy = function(req, res) {
	ucondition.destroy(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.rule(conditionId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
	
	*/
};

exports.show = function(req, res) {
	ucondition.show(req, function(data){
		res.json(data);
	});

	/*
	ninja.rule(conditionId, function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot find the condition ' + conditionId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

/*
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


var output = {
	"messageType": 10,
	"status": true,
	"error" : null,
	"taskId": req.taskId,
	"size": 0,
	"conditions" : []
};
_.each(result.preconditions, function(el){
	size++;
	output.conditions.push({
		id : '',
		type : UECONDITIONTYPE.Device,	//TODO translate
		comparisonType : UECOMPARISONTYPE.GreaterThan,	//TODO translate
		deviceType : '',
		deviceId : el.params.guid,
		beginValue : el.value,
		endValue : el.value
	});
});
output.size = size;
res.json(output);
*/


