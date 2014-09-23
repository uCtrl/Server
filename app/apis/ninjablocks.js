/**
 * NinjaBlocks API Library
 */

'use strict';

var request = require('request'),
	_ 		= require('lodash'),
	util    = require('util'),
    url     = 'https://api.ninja.is/rest/v0/';


function ninjaBlocks(options) {

	var self = this;
  	this._options = options || {};
  	this._qs = { "user_access_token" : options.userAccessToken };


  	/**
	 * Return information about the authenticated user.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.user = function(callback) {
  		request({
          url: url + 'user',
          method: 'GET',
          qs: self._qs,
          json: true
        }, function(error, response, body) {
        	callback(error, body);
        });
  	};

  	/**
	 * Returns the 30 most recent entries in the authenticating user's activity stream.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.user.stream = function(callback) {
  		request({
          url: url + 'user/stream',
          method: 'GET',
          qs: self._qs,
          json: true
        }, function(error, response, body) {
        	callback(error, body);
        });
  	};

  	/**
	 * Returns user's pusher channel key.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.user.pusherChannel = function(callback) {
  		getRequest('user/pusherchannel', callback);
  	};

  	/**
	 * Returns all the blocks paired to an account.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.blocks = function(callback) {
  		getRequest('block', callback);
  	};


	/**
	 * Base definition for block.
	 * @param  {String}   nodeId   Id of the block.  A nodeId should be a 12+ alphanumeric character identifier, 
	 * 							   ideally a unique serial number.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.block = function(nodeId, callback) {
  		
  		/**
		 * Returns data about the specified block.
		 * @param  {Function} callback   Callback when request finished or error found
		 */
  		if (callback) {
  			getRequest(util.format('block/%s', nodeId), callback);
  			return;
  		}

  		return {
  			
  			/**
			 * Attempt to claim an unclaimed block.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			claim: function(callback) {
  				postRequest('block', { "nodeid" : nodeId }, callback);
  			},
  			
  			/**
			 * Activate a block and return its token. This token should be used with all subsequent requests.
			 * Your nodeId should be a 12+ alphanumeric character identifier, ideally a unique serial number.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			activate: function(callback) {
  				getRequest(util.format('block/%s/activate', nodeId), callback);
  			},

  			/**
			 * Unpair a block.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			delete: function(callback) {
  				deleteRequest(util.format('block/%s', nodeId), callback);
  			}
  		}
  	};

  	/**
	 * Returns the list of devices associated with the authenticating user.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
	this.devices = function(callback) {
  		getRequest('devices', callback);
  	};

  	/**
	 * Base definition for device.
	 * @param  {String}   nodeId   Id of the device
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.device = function(guid, callback) {

  		/**
		 * Fetch metadata about the specified device.
		 * @param  {Function} callback   Callback when request finished or error found
		 */
  		if (callback) {
  			getRequest(util.format('device/%s', guid), callback);
  			return;
  		}

  		return {

  			/**
			 * Update a device, including sending a command.
			 * Sending a command and updating the meta data are two distinct operations internally. 
			 * If the response we send is in the affirmative, ie result = 1, then both have succeeded. 
			 * However, if it is the negative, ie result = 0, then one or both of the operations failed, and you won't know which one.
			 * We've implemented it this way for conceptual consistency. We recommend using two separate API calls if you need to handle errors.
			 * 
			 * @param  {Object}   data   Data for the request
			 * @param  {String=}  data.DA   The data value to send to the device. 
			 * @param  {String=}  data.shortName   The meta data title of the device to update.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			update: function(data, callback) {
  				putRequest(util.format('device/%s', guid), data, callback);
  			},

  			/**
			 * Delete all data about the specified device.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			delete: function(callback) {
  				deleteRequest(util.format('device/%s', guid), callback);
  			},

  			/**
			 * Return the last heartbeat for the specified device. i.e. its "current" or more accurately last reported value.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			lastData: function(callback) {
  				getRequest(util.format('device/%s/heartbeat', guid), callback);
  			},

  			/**
			 * Return the historical data for the specified device.
			 *
			 * @param  {Object}   parameters   Parameters for the request
			 * @param  {Number=}  parameters.from   Timestamp representing the beginning of the period measurements are requested for.  
			 * @param  {Number=}  parameters.to   Timestamp representing the end of the period measurements are requested for. 
			 * @param  {String=}  parameters.interval   Intervals are specified by a number and a unit of time, i.e. 6hour or 1day. The supported time units are: 
			 *										    * min - Minutes
			 *										    * hour - Hours
			 *										    * day - Days
			 *										    * month - Months
			 *										    * year - Years
			 * @param  {String=}  parameters.fn   The folding function specifies how the datapoints are reduced within each interval. 
			 *									  The default folding function is mean which returns the mean (average). The following folding functions are supported: 
	 		 *										    * mean - Average of all datapoints
			 *										    * sum - Sum of all datapoints
			 *										    * min - Minimum value of all datapoints
			 *										    * max - Maximum value of all datapoints
			 *										    * stddev - Standard deviation of all datapoints
			 *										    * ss - Sum of squares of all datapoints
			 *										    * count - Total number of datapoints in the DataSet
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			data: function(parameters, callback) {
  				var queryString = _.clone(self._qs, false);
  				parameters = parameters || {};

  				if (parameters.from) queryString["from"] = parameters.from;
  				if (parameters.to) queryString["to"] = parameters.to;
  				if (parameters.interval) queryString["interval"] = parameters.interval;
  				if (parameters.fn) queryString["fn"] = parameters.fn;

  				request({
		          url: url + util.format('device/%s/data', guid),
		          method: 'GET',
		          qs: queryString,
		          json: true
		        }, function(error, response, body) {
		        	if (!error)
		        		error = body.error;

		        	body = body.data;

		        	callback(error, body);
		        });
  			},

			/**
			 * Retrieve the current callback url registered against this device.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			getCallback: function(callback) {
  				getRequest(util.format('device/%s/callback', guid), callback);
  			},

  			/**
			 * Register a new callback against this device.
			 * @param  {Object}   data   Data for the request
			 * @param  {String}   data.url   The URL you wish to register a callback against. 
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			registerCallback: function(data, callback) {
  				postRequest(util.format('device/%s/callback', guid), data, callback);
  			},

			/**
			 * Update an existing callback against this device.
			 * @param  {Object}   data   Data for the request
			 * @param  {String}   data.url   The URL you wish to register a callback against. 
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			updateCallback: function(data, callback) {
  				putRequest(util.format('device/%s/callback', guid), data, callback);
  			},
  			
			/**
			 * Delete an existing callback against this device.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			unregisterCallback: function(callback) {
  				deleteRequest(util.format('device/%s/callback', guid), callback);
  			},
  			
  			/**
			 * Base definition for subdevice.
			 * @param  {String}   subdeviceId   Id of the subdevice
			 */
  			subdevice: function(subdeviceId) {
  				return {

  					/**
					 * Create a new sub-device associated with the specified device and return a unique ID within the device.
					 * Sub-devices allow you to store different values against one device. For example, various mobile numbers against the SMS device, 
					 * different 'webhook' actuators against the 'webhook' device, and different RF binary values against the RF433MHz device.
					 * Please note that the different categories of sub-devices may return different data. For example, the create 'webhook' 'sensor' 
					 * sub-device call will return a token that is used as part of the URL to 'tickle' it, whereas most others will just return the id of the sub-device.
					 *
					 * @param  {Object}   data   Data for the request
					 * @param  {String}   data.category   The category of sub-device. Allowed: "rf", "webhook", "sms". 
					 * 									  This determines the behavior associated with the sub-device, and MUST correspond to the type of device used against. 
					 * @param  {String}   data.type   The type of sub-device, whether it is an actuator or a sensor. Allowed: "actuator" or "sensor" 
					 * @param  {String}   data.shortName   The type of sub-device, whether it is an actuator or a sensor. Allowed: "actuator" or "sensor"  
					 * @param  {String=}  data.data   Data to be stored in the sub-device  
					 * @param  {String=}  data.url   URL to store in the sub-device in a webhook actuator (category must be 'webhook' and type must be 'actuator').  
					 * @param  {Function} callback   Callback when request finished or error found
					 */
  					create: function(data, callback) {
  						postRequest(util.format('device/%s/subdevice', guid), data, callback);
  					},
  					
  					/**
					 * Update information about the specified sub-device.
					 *
					 * @param  {Object}   data   Data for the request
					 * @param  {String=}  data.category   The category of sub-device. Allowed: "rf", "webhook", "sms". 
					 * 									   This determines the behavior associated with the sub-device, and MUST correspond to the type of device used against. 
					 * @param  {String=}  data.type   The type of sub-device, whether it is an actuator or a sensor. Allowed: "actuator" or "sensor" 
					 * @param  {String=}  data.shortName   The type of sub-device, whether it is an actuator or a sensor. Allowed: "actuator" or "sensor"  
					 * @param  {String=}  data.data   Data to be stored in the sub-device  
					 * @param  {String=}  data.url   URL to store in the sub-device in a webhook actuator (category must be 'webhook' and type must be 'actuator').  
					 * @param  {Function} callback   Callback when request finished or error found
					 */
  					update: function(data, callback) {
  						putRequest(util.format('device/%s/subdevice/%s', guid, subdeviceId), data, callback);
  					},
  					
					/**
					 * Delete the specified sub-device. Note that if there are any rules attached to this sub-device they will not be deleted, but instead become ineffectual.
					 * @param  {Function} callback   Callback when request finished or error found
					 */
  					delete: function(callback) {
  						deleteRequest(util.format('device/%s/subdevice/%s', guid, subdeviceId), callback)
  					},
  					
  					/**
					 * Fetch the count of the number of times the sub-device was actuated.
					 *
					 * @param  {Object}   parameters   Parameters for the request
					 * @param  {Number=}  parameters.from   Timestamp representing the beginning of the period measurements are requested for.  
					 * @param  {Number=}  parameters.to   Timestamp representing the end of the period measurements are requested for. 
					 * @param  {String=}  parameters.interval   Intervals are specified by a number and a unit of time, i.e. 6hour or 1day. The supported time units are: 
					 *										    * min - Minutes
					 *										    * hour - Hours
					 *										    * day - Days
					 *										    * month - Months
					 *										    * year - Years
					 * @param  {Function} callback   Callback when request finished or error found
					 */
  					data: function(parameters, callback) {
  						var queryString = _.clone(self._qs, false);
  						parameters = parameters || {};
  						
		  				if (parameters.from) queryString["from"] = parameters.from;
		  				if (parameters.to) queryString["to"] = parameters.to;
		  				if (parameters.interval) queryString["interval"] = parameters.interval;

		  				request({
				          url: url + util.format('device/%s/subdevice/%s/data', guid, subdeviceId),
				          method: 'GET',
				          qs: queryString,
				          json: true
				        }, function(error, response, body) {
				        	if (!error)
				        		error = body.error;

				        	body = body.data;

				        	callback(error, body);
				        });
  					},

  					/**
					 * Delete the specified sub-device. Note that if there are any rules attached to this sub-device they will not be deleted, but instead become ineffectual.
					 * @param  {String}  token   The token in this instance in the token received when the create sub-device with category 'webhook' and type 'sensor' call is returned.
					 * @param  {Function} callback   Callback when request finished or error found
					 */
  					tickle: function(token, callback) {
  						postRequest(util.format('device/%s/subdevice/%s/tickle/%', guid, subdeviceId, token), null, callback);
  					}
  				}
  			}

  		}
  	};

  	/**
	 * Fetch all of a users' rules.
	 * @param  {Function} callback   Callback when request finished or error found
	 */
  	this.rules = function(callback) {
  		getRequest('rule', callback);
  	}

  	/**
	 * Base definition for rule.
	 * @param  {String}   ruleId   Id of the rule
	 * @param  {Function} callback   Callback when request finished or error found
	 */
	this.rule = function(ruleId, callback) {
		
		/**
		 * Fetch the specified rule.
		 * @param  {Function} callback   Callback when request finished or error found
		 */
		if (callback) {
  			getRequest(util.format('rule/%s', ruleId), callback);
  			return;
  		}

  		return {

  			/**
			 * Create a new rule.
			 *
			 * @param  {Object}   data   Data for the request
			 * @param  {String}   data.shortName   The name of your rule. 
			 * @param  {String}   data.preconditions   Array of precondition handlers.
			 * @param  {String}   data.shortName   Array of action handlers.
			 * @param  {String=}  data.timeout   Number of seconds to wait before executing this rule again.  
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			create: function(data, callback) {
  				postRequest('rule', data, callback);
  			},
  			
  			/**
			 * Update a rule.
			 *
			 * @param  {Object}   data   Data for the request
			 * @param  {String}   data.shortName   The name of your rule. 
			 * @param  {String}   data.preconditions   Array of precondition handlers.
			 * @param  {String}   data.shortName   Array of action handlers.
			 * @param  {String=}  data.timeout   Number of seconds to wait before executing this rule again.  
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			update: function(data, callback) {
  				putRequest(util.format('rule/%s', ruleId), data, callback);
  			},
  			
  			/**
			 * Delete a rule.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			delete: function(callback) {
  				deleteRequest(util.format('rule/%s', ruleId), callback);
  			},
  			
			/**
			 * Suspend a rule.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			suspend: function(callback) {
  				postRequest(util.format('rule/%s/suspend', ruleId), null, callback);
  			},
  			
  			/**
			 * Unsuspend a rule.
			 * @param  {Function} callback   Callback when request finished or error found
			 */
  			unsuspend: function(callback) {
  				deleteRequest(util.format('rule/%s/suspend', ruleId), callback);
  			}
  		}
  	}

  	/**
	 * Helpers section
	 */
  	function getRequest(urn, callback) {
  		request({
          url: url + urn,
          method: 'GET',
          qs: self._qs,
          json: true
        }, function(error, response, body) {
        	if (!error)
        		error = body.error;

        	body = body.data;

        	callback(error, body);
        });
	}

  	function postRequest(urn, data, callback) {
  		request({
          url: url + urn,
          method: 'POST',
          qs: self._qs,
          json: true,
          body: data
        }, function(error, response, body) {
        	if (!error)
        		error = body.error;
        	
        	callback(error, body);
        });
	}

	function putRequest(urn, data, callback) {
  		request({
          url: url + urn,
          method: 'PUT',
          qs: self._qs,
          json: true,
          body: data
        }, function(error, response, body) {
        	if (!error)
        		error = body.error;
        	
        	callback(error, body);
        });
	}

	function deleteRequest(urn, callback) {
  		request({
          url: url + urn,
          method: 'DELETE',
          qs: self._qs,
          json: true
        }, function(error, response, body) {
        	if (!error)
        		error = body.error;
        	
        	callback(error, body);
        });
	}
}

/**
 * Exports Ninjablocks object
 * @type Ninjablocks
 */
module.exports = ninjaBlocks;