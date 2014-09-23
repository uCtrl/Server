'use strict';
var _ = require('underscore');
var ninjaBlocks = require('ninja-blocks');
var ninja = ninjaBlocks.app({user_access_token:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"});

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

exports.get = function(req, res) {
	if (!req.params.taskId) {
		res.json(null);
	} 
	else {
		var output = {
			"messageType": 10,
			"status": true,
			"error" : null,
			"taskId": req.params.taskId,
			"size": 0,
			"conditions" : []
		};
		
		ninja.rule(req.params.taskId).get(function(err, result){
			//res.json(result.preconditions);
			var size = 0;
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
		});
	}
};

/*
var TRANSLATOR = {
	"":"",
	"":"",
	"":"",
	"equality":"beginValue",
	"":""
};
_.each(result, function(el){
				
			})
    jsonObj["id"] = getId();
    jsonObj["type"] = (int) getType();
    jsonObj["comparisonType"] = (int) getComparisonType();
	
    case UEConditionType::Date (1)
		jsonObj["beginDate"] = m_beginDate.toString(Qt::DateFormat::ISODate);
		jsonObj["endDate"] = m_endDate.toString(Qt::DateFormat::ISODate);
    case UEConditionType::Time:
		jsonObj["beginTime"] = m_beginTime.toString("hh:mm");
		jsonObj["endTime"] = m_endTime.toString("hh:mm");
    case UEConditionType::Day:
        jsonObj["selectedWeekdays"] = getSelectedWeekdays();
    case UEConditionType::Device:		
		jsonObj["deviceType"] = (int)getDeviceType();
		jsonObj["deviceId"] = getDeviceId();
		jsonObj["beginValue"] = getBeginValue();
		jsonObj["endValue"] = getEndValue();
	
*/