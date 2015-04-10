"use strict";

var configuration = require('./configure');
var api = require('./api');

module.exports = function () {
    
    function configure(options) {
        api.configure(options);
    }
    
    function login(config, cb) {
        api.login(config, cb);
    }
    
    return {
        version: configuration.sdkVersion,
        configure: configure,
        configuration: configuration.default_options,
        login: login,
        availability: require('./interfaces/Availability')(),
        booking: require('./interfaces/Booking')()
    };
};