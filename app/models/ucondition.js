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
	Not: 0x10
};
var DAYSECONDS = 86400;
var WEEKSECONDS = 604800;

/**
 * UCondition Schema
 */
var UConditionSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	parentId: String,
	tpId: String,
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
	_user : {
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},
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
			result = lstPeriod[i+2] == lstPeriod[i] + DAYSECONDS ? true : false;
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
				var timeCondition = new UCondition({
					id : uuid.v1(),
					tpId : ninjaPreconditionId,
					type : ENUMCONDITIONTYPE.Time,
					comparisonType : ENUMCOMPARISONTYPE.InBetween,
					beginValue : ninjaPrecondition.params.times[0],
					endValue : ninjaPrecondition.params.times[1],
					enabled : true
				});
				lstCondition.push(timeCondition);
			}
			else {//if weekday periodicTODOOO
				var days = 0;
				var timeBeginValue = 0;
				var timeEndValue = 0;
				
				for(var i = 0; i <= lstPeriodSize-2; i+=2) {
					var currDay = Math.floor(ninjaPrecondition.params.times[i] / DAYSECONDS);
					days += Math.pow(2, currDay);
					timeBeginValue = ninjaPrecondition.params.times[i] % DAYSECONDS;
					timeEndValue = ninjaPrecondition.params.times[i+1] % DAYSECONDS;
				}
				var dayCondition = new UCondition({
					id : uuid.v1(),
					tpId : ninjaPreconditionId + ':' + 0,
					type : ENUMCONDITIONTYPE.Day,
					comparisonType : ENUMCOMPARISONTYPE.None,
					beginValue : days,
					endValue : days,
					enabled : true
				});
				var timeCondition = new UCondition({
					id : uuid.v1(),
					tpId : ninjaPreconditionId + ':' + 1,
					type : ENUMCONDITIONTYPE.Time,
					comparisonType : ENUMCOMPARISONTYPE.InBetween,
					beginValue : timeBeginValue,
					endValue : timeEndValue,
					enabled : true,
				});
				lstCondition.push(dayCondition);
				lstCondition.push(timeCondition);
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
				lastUpdated : null
			});
			switch (ninjaPrecondition.handler) {
				//when condition includes a rf subdevice.
				case 'ninjaChange' : 	
					condition.deviceTpId = ninjaPrecondition.params.guid + ':' + ninjaPrecondition.params.to;
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
	var UDevice = mongoose.model('UDevice');
	var ninjaPrecondition = { 
		handler: null, 
		params: { 
			//equality : null,
			guid : null,
			//to : null,
			//value : null,
			//between : null,
			//and : null,
			//shortName : null,
			//times : null,
			//timezone : null
		}
	}
	switch (condition.type) {
		case ENUMCONDITIONTYPE.None :
			cb(ninjaPrecondition);
			break;//no mapping possible
		case ENUMCONDITIONTYPE.Date :
			cb(ninjaPrecondition);
			break;//no mapping possible
		case ENUMCONDITIONTYPE.Day ://weekly periodic
			ninjaPrecondition.handler = 'weeklyTimePeriod';
			ninjaPrecondition.params.guid = "time";
			ninjaPrecondition.params.shortName = "Time";
			ninjaPrecondition.params.timezone = "America/Montreal";//TODO
			ninjaPrecondition.params.times = [];
			var days = parseInt(condition.beginValue);
			for(var i=0; i<=6; i++) {
				if (days & Math.pow(2, 6-i)) {
					var beginTime = (6-i) * DAYSECONDS;
					var endTime = DAYSECONDS + ((6-i) * DAYSECONDS) - 1;
					ninjaPrecondition.params.times.push(beginTime);
					ninjaPrecondition.params.times.push(endTime);
				}
			}
			cb(ninjaPrecondition);
			break;
		case ENUMCONDITIONTYPE.Time ://daily periodic
			ninjaPrecondition.handler = 'weeklyTimePeriod';
			ninjaPrecondition.params.guid = "time";
			ninjaPrecondition.params.shortName = "Time";
			ninjaPrecondition.params.timezone = "America/Montreal";//TODO
			ninjaPrecondition.params.times = [];
			switch (condition.comparisonType) {
				case ENUMCOMPARISONTYPE.GreaterThan :
					for (var i=0; i<=6; i++) {
						var beginVal = parseInt(condition.beginValue) + (i * DAYSECONDS);
						var endVal = DAYSECONDS + (i * DAYSECONDS) - 1;//end of day
						ninjaPrecondition.params.times.push(beginVal);
						ninjaPrecondition.params.times.push(endVal);
					}
					break;
				case ENUMCOMPARISONTYPE.LesserThan :
					for (var i=0; i<=6; i++) {
						var beginVal = 0 + (i * DAYSECONDS);//beginning of day
						var endVal = parseInt(condition.endValue) + (i * DAYSECONDS);
						ninjaPrecondition.params.times.push(beginVal);
						ninjaPrecondition.params.times.push(endVal);
					}
					break;
				case ENUMCOMPARISONTYPE.Not :
					for (var i=0; i<=6; i++) {
						var beginVal = parseInt(condition.endValue) + (i * DAYSECONDS) + 1;
						var endVal = parseInt(condition.beginValue) + (i * DAYSECONDS) - 1;
						ninjaPrecondition.params.times.push(beginVal);
						ninjaPrecondition.params.times.push(endVal);
					}
					break;
				case ENUMCOMPARISONTYPE.None :
				case ENUMCOMPARISONTYPE.InBetween :
				case ENUMCOMPARISONTYPE.Equals :
				default :
					for (var i=0; i<=6; i++) {
						var beginVal = parseInt(condition.beginValue) + (i * DAYSECONDS);
						var endVal = parseInt(condition.endValue) + (i * DAYSECONDS);
						ninjaPrecondition.params.times.push(beginVal);
						ninjaPrecondition.params.times.push(endVal);
					}
					break;
			}
			cb(ninjaPrecondition);
			break;
		case ENUMCONDITIONTYPE.Device :
			UDevice.findOne({ id: condition.deviceId }).exec(function(err, device) {
				if(err) console.log('--ERROR : ' + err);
				if(device) {
					var deviceTpIdSplit = device.tpId.split(":");//subdevice id, if one, is stored into id.
					ninjaPrecondition.params.guid = deviceTpIdSplit[0];
					if (deviceTpIdSplit.length > 1) { // is a subdevice
						if (UDevice.isSwitch(deviceTpIdSplit[1])){
							condition.deviceValue = (condition.deviceValue == '1') ? UDevice.switchOn(deviceTpIdSplit[1]) : UDevice.switchOff(deviceTpIdSplit[1])
						}
					}
					switch (condition.comparisonType) {
						case ENUMCOMPARISONTYPE.None :
							ninjaPrecondition.handler = 'ninjaChange';
							ninjaPrecondition.params.to	= UDevice.toSpecialCase(device.tpId, device.type, condition.deviceValue);
							ninjaPrecondition.params.shortName	= UDevice.isSwitch(condition.deviceValue) ? UDevice.switchTinyId(condition.deviceValue): condition.deviceValue;
							break;
						case ENUMCOMPARISONTYPE.GreaterThan :
							ninjaPrecondition.handler = 'ninjaThreshold';//can be ninjaEquality
							ninjaPrecondition.params.equality = 'GT';
							ninjaPrecondition.params.value = condition.deviceValue;
							break;
						case ENUMCOMPARISONTYPE.LesserThan :
							ninjaPrecondition.handler = 'ninjaThreshold';//can be ninjaEquality
							ninjaPrecondition.params.equality = 'LT';	
							ninjaPrecondition.params.value = condition.deviceValue;
							break;
						case ENUMCOMPARISONTYPE.Equals :
							ninjaPrecondition.handler = 'ninjaThreshold';//can be ninjaEquality
							ninjaPrecondition.params.equality = 'EQ';
							ninjaPrecondition.params.value = condition.deviceValue;
							break;
						case ENUMCOMPARISONTYPE.InBetween :
							ninjaPrecondition.handler = 'ninjaRangeToggle';
							ninjaPrecondition.params.between = condition.beginValue;
							ninjaPrecondition.params.and = condition.endValue;
							break;
					}
				}
				cb(ninjaPrecondition);
			});
			break;
	}
};

UConditionSchema.plugin(cleanJson);
mongoose.model('UCondition', UConditionSchema);
