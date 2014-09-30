'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uplatform = mongoose.model('UPlatform');
var ucondition = mongoose.model('UCondition');

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

/*
var output = {
	"messageType": 10,
	"status": true,
	"error" : null,
	"taskId": req.params.taskId,
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

exports.all = function(req, res) {
	// We'll use DB later. For now, let's return the rules
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						scenarioObj.tasks.forEach(function(taskObj, taskIndex){
							if(taskObj.id == req.params.taskId){
								res.json(taskObj.conditions);
							}
						});
					}
				});
			}
		});
	});
	
	/*
	ninja.rules(function(err, data){
		res.json(data);
	});
	
	*/
};

exports.create = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
							if(scenarioObj.id == req.params.scenarioId){
								scenarioObj.tasks.forEach(function(taskObj, taskIndex){
									if(taskObj.id == req.params.taskId){
										var obj = new ucondition(req.body);
										platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks[taskIndex].conditions.push(obj);
										platformObj.save();
										res.json("created");
									}
								});
							}
						});
					}
				});
			}
		});
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
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						scenarioObj.tasks.forEach(function(taskObj, taskIndex){
							if(taskObj.id == req.params.taskId){
								taskObj.conditions.forEach(function(conditionObj, conditionIndex){
									if(conditionObj.id == req.params.conditionId){
										platformObj.devices[deviceIndex].scenarios[scenarioIndex].tasks[taskIndex].conditions.remove(conditionObj._id.toString());
										platformObj.save();
										res.json("destroyed");
									}
								});
							}
						});
					}
				});
			}
		});
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
	uplatform.findOne({id : req.params.platformId}, function(err, platformObj){
		platformObj.devices.forEach(function(deviceObj, deviceIndex){
			if(deviceObj.id == req.params.deviceId){
				deviceObj.scenarios.forEach(function(scenarioObj, scenarioIndex){
					if(scenarioObj.id == req.params.scenarioId){
						scenarioObj.tasks.forEach(function(taskObj, taskIndex){
							if(taskObj.id == req.params.taskId){
								taskObj.conditions.forEach(function(conditionObj, conditionIndex){
									if(conditionObj.id == req.params.conditionId){
										res.json(conditionObj);
									}
								});
							}
						});
					}
				});
			}
		});
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


