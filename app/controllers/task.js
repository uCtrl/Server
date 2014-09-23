'use strict';
var _ = require('underscore');
var ninjaBlocks = require('ninja-blocks');
var ninja = ninjaBlocks.app({user_access_token:"107f6f460bed2dbb10f0a93b994deea7fe07dad5"});

exports.get = function(req, res) {
	if (!req.params.scenarioId) {
		res.json(null);
	} 
	else {
		var output = {
			"messageType": 8,
			"status": true,
			"error" : null,
			"scenarioId": req.params.scenarioId,
			"size": 0,
			"tasks": []
		};
		
		ninja.rules().get(function(err, result){
			var size = 0;
			_.each(result, function(el){
				size++;
				output.tasks.push({
					id : '',
					status : el.actions[0].params.da,
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