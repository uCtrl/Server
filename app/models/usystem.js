'use strict';

/**
 * µCtrl Model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*USystem*/
var USystemSchema 	= new Schema({
	rev    			: Number,
	platforms 		: [UPlatformSchema],
});
mongoose.model('USystem', USystemSchema);
var USystemModel = mongoose.model('USystem');


/*UPlatform*/
var UPlatformSchema	= new Schema({
	firmwareVersion	: String,
	id				: Number,
	name			: String,
	port			: Number,
	room			: String,
	enabled			: String,
	ip				: String,
	devices			: [UDeviceSchema],
});
mongoose.model('UPlatform', UPlatformSchema);
var UPlatformModel = mongoose.model('UPlatform');

var UDeviceSchema 	= new Schema({
	description		: String,
	enabled			: String,
	id				: Number,
	isTriggerValue	: Boolean,
	maxValue		: Number,
	minValue		: Number,
	name			: String,
	precision		: Number,
	status			: Number,
	type			: Number,
	unitLabel		: String,
	scenarios		: [UScenarioSchema],
});
mongoose.model('UDevice', UDeviceSchema);
var UDeviceModel = mongoose.model('UDevice');

var UScenarioSchema = new Schema({
	id				: Number,
	name			: String,
	tasks			: [UTaskSchema],
});
mongoose.model('UScenario', UScenarioSchema);
var UScenarioModel = mongoose.model('UScenario');

var UTaskSchema 	= new Schema({
	id				: Number,
	status			: String,
	conditions		: [UConditionSchema],
});
mongoose.model('UTask', UTaskSchema);
var UTaskModel = mongoose.model('UTask');

var UConditionSchema = new Schema({
	id				: Number,
	type			: Number,
	beginValue		: Number,
	comparisonType	: Number,
	deviceId		: Number,
	deviceType		: Number,
	endValue		: Number,
});
mongoose.model('UCondition', UConditionSchema);
var UConditionModel = mongoose.model('UCondition');


USystem.find({}, function(err, result){
	console.log(result);
});

//use this web site for CRUD reference.
 
//TESTS
/*
USystemHelper.create(new {
		rev : 99,
		platforms : [],
	}, function(err){
	console.log(err);
});
USystemSchema.statics.findByRev = function (a_rev, cb) {
  this.find({ rev: a_rev }, cb);
}

var newSystem = new USystem();
newSystem.rev = 4;
var newPlatform = new UPlatform();
	newPlatform.firmwareVersion	= "1.0.0.2225";
	newPlatform.id				= 4000;
	newPlatform.name			= "My other platform";
	newPlatform.port			= 6000;
	newPlatform.room			= "Kitchen";
	newPlatform.enabled			= "OFF";
	newPlatform.ip				= "127.0.0.1";
newSystem.platforms.push(newPlatform);
newSystem.save(function (err) {
  if (!err) console.log('##Save newSystem success!##');
});
*/

/*
system.update(
    {'_id': "54247dcb7b0b187820fc3efd"}, 
    { $pull: { "platforms" : { id: 4000 } } },
	false,
	function(err) {
        console.log('COMPLETED');
});

*/
/*
system.findById("54247dcb7b0b187820fc3efd", function (err, post) {
  if (!err) {
    post.platforms.pull();
    post.save(function (err) {
      // do something
    });
  }
});
*/



/*
//Example getter setter Mongoose
	function toLower (v) {
	  return v.toLowerCase();
	}
	var USystemSchema 	= new Schema({
		rev				: { type: Number, set: toLower, get: toLower} 
		platforms 		: [UPlatformSchema],
	});
*/

/*
Example of code to use
****************************
// retrieve my model
var system = mongoose.model('USystem');

// create a sample
var test = new system();
test.rev = 2;
var testplat = new platform();
// create a comment
testplat.firmwareVersion= "1.0.0.2225";
testplat.id				= 157257547;
testplat.name			= "My other platform";
testplat.port			= 6000;
testplat.room			= "Kitchen";
testplat.enabled		= "OFF";
testplat.ip				= "127.0.0.1";
testplat.save(function (err) {
  if (!err) console.log('Save platform success!');
});

test.platforms.push(testplat);
test.save(function (err) {
  if (!err) console.log('Save system success!');
});

system.findById(myId, function (err, test) {
  if (!err) {
    test.platforms[0].remove();
    test.save(function (err) {
      // do something
    });
  }
});

system.find({ 'platforms.id': 157257547}, function (err, doc){
  console.log(doc);
})
var USystemHelper = {
	create : function(newItem, cb){
		var newSystem = new USystem();
		for(var i in newItem){ 
			newSystem[i] = newItem[i]; 
		}
		newSystem.save(function(err){
			if (typeof cb === "function") {
				cb(err);
			}
		});
	}
	update : function(newItem, cb){
		var newSystem = new USystem();
		for(var i in newItem){ 
			newSystem[i] = newItem[i]; 
		}
		newSystem.save(function(err){
			if (typeof cb === "function") {
				cb(err);
			}
		});
	}
}
*/