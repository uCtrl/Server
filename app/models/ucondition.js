'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

/**
 * Constants
 */
var ENUMCONDITIONTYPE = {
	None: -1,
	Date: 1,
	Day: 2,
	Time: 3,
	Device: 4
};

var ENUMCOMPARISONTYPE = {
	None: 0,
	GreaterThan: 0x1,
	LesserThan: 0x2,
	Equals: 0x4,
	InBetween: 0x8,
	Not: 0x16
};

/**
 * UCondition Schema
 */
var UConditionSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	parentId: {
		type: String,
		required: true
	},
	tpId: {
		type: String,
		required: true,
		unique: true
	},
	type: {
		type: Number,
		required: true
	},
	comparisonType: {
		type: Number,
		required: true
	},
	beginValue: String,
	endValue: String,
	deviceId: String,
	deviceTpId: String,
	deviceValue: String,
	enabled: Boolean,
	lastUpdated: Number,
	_task: {
		type: Schema.Types.ObjectId, 
		ref: 'UTask'
	}
});

/** 
 * Middlewares
 */
UConditionSchema.post('save', function (condition) {
	var UTask = mongoose.model('UTask');
	UTask.update(
		{ _id: condition._task }, 
		{ $addToSet: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

// Can't use middleware on findAndUpdate functions

UConditionSchema.post('remove', function (condition) {
	var UTask = mongoose.model('UTask');

	UTask.update(
		{ _id: condition._task }, 
		{ $pull: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

/*
 * Receives the precondition (from NB) and will call the cb when mapped.
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.fromNinjaBlocks = function (ninjaPrecondition, ninjaPreconditionId, cb) {
	var UCondition = mongoose.model('UCondition');
	var UDevice = mongoose.model('UDevice');
	var lstCondition = [];
	
	/* 
	 * Verify if the precondition is a daily periodic. 
	 * It will contain 14 elements and be 86400 seconds periodic 
	*/
	var isDailyPeriodic = function(lstPeriod) {
		var lstPeriodSize = lstPeriod.length;
		var i = 0;
		var result = lstPeriodSize == 14 ? true : false;
		while(result && (i <= lstPeriodSize-4))
		{
			result = lstPeriod[i+2] == lstPeriod[i] + 86400 ? true : false;
			i+=2;
		}
		return result;
	}
	
	/* 
	 * Change seconds to hh:mm:ss 
	*/
	var secondToTime = function(second) {
		var hours = parseInt( second / 3600 ) % 24;
		var minutes = parseInt( second / 60 ) % 60;
		var seconds = second % 60;
		return (hours < 10 ? "0" + hours : hours) + "-" + (minutes < 10 ? "0" + minutes : minutes) + "-" + (seconds  < 10 ? "0" + seconds : seconds);
	}
	
	switch (ninjaPrecondition.handler) {
		case 'weeklyTimePeriod'://time (weekly, by seconds)
			var lstPeriodSize = ninjaPrecondition.params.times.length;
			
			if (isDailyPeriodic(ninjaPrecondition.params.times)) {//if daily periodic
				// Mapping Ninja to uCtrl
				var condition = new UCondition({
					id : uuid.v1(),
					tpId : ninjaPreconditionId,
					type : ENUMCONDITIONTYPE.Time,
					comparisonType : ENUMCOMPARISONTYPE.InBetween,
					beginValue : ninjaPrecondition.params.times[0],
					endValue : ninjaPrecondition.params.times[1],
					deviceId : null,
					deviceTpId : null,
					deviceValue : null,
					enabled : true,
					lastUpdated : null,
				});
				lstCondition.push(condition);
			}
			else {//if weekday periodic
				for(var i = 0; i <= lstPeriodSize-2; i+=2) {
					// Mapping Ninja to uCtrl
					var weekcondition = new UCondition({
						id : uuid.v1(),
						tpId : ninjaPreconditionId + ':' + i,
						type : ENUMCONDITIONTYPE.Day,
						comparisonType : ENUMCOMPARISONTYPE.InBetween,
						beginValue : ninjaPrecondition.params.times[i],
						endValue : ninjaPrecondition.params.times[i+1],
						deviceId : null,
						deviceTpId : null,
						deviceValue : null,
						enabled : true,
						lastUpdated : null,
					});
					lstCondition.push(weekcondition);
				}
			}
			break;
		case 'ninjaChange':
		case 'ninjaEquality':
		case 'ninjaThreshold':
		case 'ninjaRangeToggle'://device
			var condition = new UCondition({
				id : uuid.v1(),
				tpId : ninjaPreconditionId,
				type : ENUMCONDITIONTYPE.Device,
				comparisonType : null,
				beginValue : null,
				endValue : null,
				deviceId : null,
				deviceTpId : null,
				deviceValue : null,
				enabled : true,
				lastUpdated : null,
			});
			switch (ninjaPrecondition.handler) {
				//when condition includes a rf subdevice.
				case 'ninjaChange' : 	
					condition.deviceTpId = ninjaPrecondition.params.guid + ':' + ninjaPrecondition.params.to; //TODO don't have access to subdevice id
					condition.comparisonType = ENUMCOMPARISONTYPE.None;
					condition.deviceValue = ninjaPrecondition.params.to;
					break;
				case 'ninjaEquality' : 
				case 'ninjaThreshold' : 
					condition.deviceTpId = ninjaPrecondition.params.guid;
					switch (ninjaPrecondition.params.equality) {
						case 'GT' :
						case 'GTE' :
							condition.comparisonType = ENUMCOMPARISONTYPE.GreaterThan;
							break;
						case 'LT' :
						case 'LTE' :
							condition.comparisonType = ENUMCOMPARISONTYPE.LesserThan;
							break;
						case 'EQ' :
							condition.comparisonType = ENUMCOMPARISONTYPE.Equals;
							break;
					}
					condition.deviceValue = ninjaPrecondition.params.value;
					break;
				case 'ninjaRangeToggle' : 
					condition.deviceTpId = ninjaPrecondition.params.guid;
					condition.comparisonType = ENUMCOMPARISONTYPE.InBetween;
					condition.beginValue = ninjaPrecondition.params.between;
					condition.endValue = ninjaPrecondition.params.and;
					break;
			}
			lstCondition.push(condition);
			break;
	}
	
	cb(lstCondition);
};

/*
 * Receives the ucondition (from MongoDB) and will call the cb when mapped
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.toNinjaBlocks = function (condition, cb) {
	var deviceTpIdSplit = condition.deviceTpId.split(":");	//Subdevice id, if one, is stored into id.
	
	var ninjaPrecondition = { 
		handler: null, 
		params: { 
			equality : null,
			guid : deviceTpIdSplit[0],
			to : null,
			value : null,
			between : null,
			and : null,
			shortName : null,
			times : null,
			timezone : null,
		}
	}

	switch (condition.type) {
		case ENUMCONDITIONTYPE.Date :
		case ENUMCONDITIONTYPE.Time :
			ninjaPrecondition.handler = 'weeklyTimePeriod';
			ninjaPrecondition.params.timezone = "America/Montreal"
			ninjaPrecondition.params.times.push(condition.beginValue);
			ninjaPrecondition.params.times.push(condition.endValue);
			break;
		case ENUMCONDITIONTYPE.Device :
			switch (condition.comparisonType) {
				//When condition include a rf subdevice.
				case ENUMCOMPARISONTYPE.None :
					ninjaPrecondition.handler = 'ninjaChange';
					ninjaPrecondition.params.to	= condition.deviceValue;
					break;
				case ENUMCOMPARISONTYPE.GreaterThan :
					ninjaPrecondition.handler = 'ninjaEquality';//can be ninjaThreshold
					ninjaPrecondition.params.equality = 'GT';
					ninjaPrecondition.params.value = condition.deviceValue;
					break;
				case ENUMCOMPARISONTYPE.LesserThan :
					ninjaPrecondition.handler = 'ninjaEquality';//can be ninjaThreshold
					ninjaPrecondition.params.equality = 'LT';	
					ninjaPrecondition.params.value = condition.deviceValue;
					break;
				case ENUMCOMPARISONTYPE.Equals :
					ninjaPrecondition.handler = 'ninjaEquality';//can be ninjaThreshold
					ninjaPrecondition.params.equality = 'EQ';
					ninjaPrecondition.params.value = condition.deviceValue;
					break;
				case ENUMCOMPARISONTYPE.InBetween :
					ninjaPrecondition.handler = 'ninjaRangeToggle';
					ninjaPrecondition.params.between = condition.beginValue;
					ninjaPrecondition.params.and = condition.endValue;
					break;
			}
			break;
	}
	cb(ninjaPrecondition);
};

UConditionSchema.plugin(cleanJson);
mongoose.model('UCondition', UConditionSchema);
