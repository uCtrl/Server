'use strict';

// Singleton 
module.exports.NotificationCenter = (function () {
    var instance;
    var callbacks = {};

    function createInstance() {
        return {
            registerCallback: function (id, cb) {
                callbacks[id] = cb;
                return true;
            },

            triggerEvent: function(id, data) {
                if (!callbacks[id])
                    return false;

                callbacks[id](data);
            }
        };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();