'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
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
	}
});

/*
 * Create default user
 */
UserSchema.statics.createDefault = function (cb) {
	var User = mongoose.model('User');
	var user = new User({
		id : uuid.v1(),
		tpId : global.uctrl.ninja.userTpId, 
		name : global.uctrl.ninja.userName,
		email : global.uctrl.ninja.userEmail,
		ninjablocks: { 
			userAccessToken: global.uctrl.ninja.userAccessToken,
			pusherChannelToken: global.uctrl.ninja.pusherChannelToken,
		}
	});
	cb(user);
};

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 */
UserSchema.statics.fromNinjaBlocks = function (ninjaUser, ninjaUserId, ninjaUserAccessToken, cb) {
	var User = mongoose.model('User');
	// Mapping Ninja to uCtrl
	var user = new User({
		id : uuid.v1(),
		tpId : ninjaUserId, 
		name : ninjaUser.name,
		email : ninjaUser.email,
		ninjablocks: { 
			userAccessToken: ninjaUserAccessToken,
			pusherChannelToken: ninjaUser.pusherChannel,
		}
	});
	cb(user);
};

mongoose.model('User', UserSchema);