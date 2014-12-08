'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

var UserSchema = new Schema({
	id: String,
	tpId: String,
	name: String,
	email: String,
	ninjablocks: {
		userAccessToken: String,
		pusherChannelToken: String
	},
	_platforms: [
		{
			type: Schema.Types.ObjectId,
			ref: 'UPlatform'
		}
	]
});

UserSchema.post('save', function () {
	//Nothing to do
});

// Can't use middleware on findAndUpdate functions

UserSchema.post('remove', function (user) {
	var UPlatform = mongoose.model('UPlatform');

	UPlatform.find({ _id: { $in: user._platforms } }, function (err, platforms) {
		if (err) {
			console.log('Error: ', err);
			return;
		}
		_(platforms).forEach(function (platform) {
			platform.remove();
		});
	});
});

/*
 * Create default user
 */
UserSchema.statics.createDefault = function (cb) {
	var User = mongoose.model('User');
	var user = new User({
		id: uuid.v1(),
		tpId: global.uctrl.ninja.userTpId,
		name: global.uctrl.ninja.userName,
		email: global.uctrl.ninja.userEmail,
		ninjablocks: {
			userAccessToken: global.uctrl.ninja.userAccessToken,
			pusherChannelToken: global.uctrl.ninja.pusherChannelToken
		}
	});
	cb(user);
};

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UserSchema.statics.fromNinjaBlocks = function (ninjaUser, ninjaUserAccessToken, cb) {
	var User = mongoose.model('User');
	// Mapping Ninja to uCtrl
	var user = new User({
		id: uuid.v1(),
		tpId: ninjaUser.id,
		name: ninjaUser.name,
		email: ninjaUser.email,
		ninjablocks: {
			userAccessToken: ninjaUserAccessToken,
			pusherChannelToken: ninjaUser.pusherChannel
		}
	});
	cb(user);
};

UserSchema.plugin(cleanJson);
mongoose.model('User', UserSchema);