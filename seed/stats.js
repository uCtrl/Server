'use strict';

(function() { process.env.NODE_ENV = 'development'; })();

var config = require(__dirname + '/../config/config.js'),
_ = require('lodash'),
mongoose = require('mongoose'),
Q = require('q'),
async = require('async'),
UPlatform = mongoose.model('UPlatform'),
UDevice = mongoose.model('UDevice'),
UScenario = mongoose.model('UScenario'),
UTask = mongoose.model('UTask'),
UCondition = mongoose.model('UCondition'),
Stats = mongoose.model('Stats'),
Logs = mongoose.model('Log');

module.exports = function() {




    Q.ninvoke(mongoose,'connect', config.db)
    .then(function () {
        var now = Date.now();
        var days = _.map([0,1,2,3,4,5,6,7], function (x) { return x* 24* 3600 * 1000;});
        var hours = [];
        for (i = 0; i < 24; i++) { 
            hours.push(i * 3600*1000);
        }
        var mins = [];
        for (var i = 0; i < 60; i++) { 
            mins.push(i * 1000);
        }

        function makeTimestamps() {
            var timestamps = _.map(days, function(d) {
                return _.map(hours, function(h) {
                    var rand = _.random(0,7);
                    var wentBy = [];
                    for (var i=0; i < rand; i++) {
                        wentBy[i] = _.random(0, mins[20]) + h + d;
                    }
                    return wentBy;
                });
            });
            timestamps = _.sortBy(_.map(_.flatten(timestamps), function(x) {
                return now - x;
            }));
            return timestamps;
        }


        async.waterfall([
            function getDevices(cb){
                UDevice.find(function(err, devices){
                    cb(err, devices);
                });
            },

            function fillDoors(devices, cb) {
                var ids = [
                    '1014BBBK6089_0_0_11:111101010101011101010000',
                    '1014BBBK6089_0_0_11:110100110101010100110000',
                    '1014BBBK6089_0_0_11:010101011111000101010000',
                    '1014BBBK6089_0_0_11:010111010100011100110000',
                    '1014BBBK6089_0_0_11:010000010101110101010000',
                    '1014BBBK6089_0_0_11:110111011101010101010000',
                    '1014BBBK6089_0_0_11:110101000101110101010000'];

                async.each(ids, function(id, callback_id) {
                    var door = _.find(devices, {tpId: id });
                    var timestamps = makeTimestamps();
                    async.each(timestamps, function(t, callback_t) {
                        var o = new Stats({
                            id: door.id,
                            data: door.value,
                            type: 11,
                            timestamp: t
                        });
                        o.save(function(err, o){
                            callback_t(err);
                        });
                    }, function (err) {
                        if (err) callback_id(err);
                        callback_id(null);
                    });
                }, function(err) {
                    cb(err, devices);
                });
            },

            function fillLEDS(devices, cb) {

                var ids = [
                '1014BBBK6089_3whiteH149ee01a96a_0_1012',
                '1014BBBK6089_2whiteH149ee01a96a_0_1012',
                '1014BBBK6089_1whiteH149ee01a96a_0_1012'];


                async.each(ids, function(id, callback_id) {
                    var led = _.find(devices, {tpId: id });


                    var timestamps = _.map(days, function(d) {
                        var start =    (d + hours[_.random(5,7)] + _.random(0, mins[20]));
                        var fin =      (d + hours[_.random(9,11)] + _.random(0, mins[20]));
                        var start2 =   (d + hours[_.random(16,18)] + _.random(0, mins[20]));
                        var fin2 =     (d + hours[_.random(21,23)] + _.random(0, mins[20]));

                        return [start, fin, start2, fin2];
                    });
                    timestamps = _.sortBy(_.map(_.flatten(timestamps), function(x) {
                        return now - x;
                    }));

                    async.each(timestamps, function(t, callback_t) {
                        var index = _.findIndex(timestamps, t) % 2;

                        var o = new Stats({
                            id: led.id,
                            data: index? _.random(0,40) : _.random(200,250),
                            type: 1012,
                            timestamp: t
                        });
                        o.save(function(err, o){
                            callback_t(err);
                        });
                    }, function (err) {
                        if (err) callback_id(err);
                        callback_id(null);
                    });
                }, function(err) {
                    cb(err, devices);
                });

            }, function fillTemp(devices, cb) {

                var ids = [
                '1014BBBK6089_0101_0_31'];


                async.each(ids, function(id, callback_id) {
                    var temp = _.find(devices, {tpId: id });
                    var values = [];

                    var timestamps = _.map(days, function(d) {
                        var temps = [17,17,18,18,18,18,19,19,20,21,22,23,22,21,20,20,20,19,20,19,18,18,17,17];

                        _.forEach(temps, function (x) {
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                            values.push(x + _.random(0, 0.3));
                        });

                        return _.map(hours, function (x) {
                            return [
                                x + d + mins[0],
                                x + d + mins[6],
                                x + d + mins[13],
                                x + d + mins[19],
                                x + d + mins[26],
                                x + d + mins[32],
                                x + d + mins[38],
                                x + d + mins[46],
                                x + d + mins[52]];
                        });
                    });

                    timestamps = _.sortBy(_.map(_.flatten(timestamps), function(x) {
                        return now - x;
                    }));

                    async.each(timestamps, function(t, callback_t) {
                        var index = _.indexOf(timestamps, t);
                        var o = new Stats({
                            id: temp.id,
                            data: values[index],
                            type: 1012,
                            timestamp: t
                        });
                        o.save(function(err, o){
                            callback_t(err);
                        });
                    }, function (err) {
                        if (err) callback_id(err);
                        callback_id(null);
                    });
                }, function(err) {
                    cb(err, devices);
                });
            }],

            function(err, results) {
                if (err) console.log ("Error seeding stats and logs", err);
                console.log("Done seeding stats.");
            });
})
.catch(function(err) {
    console.log(err);
});
};



