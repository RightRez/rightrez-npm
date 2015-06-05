"use strict";

var querystring = require('querystring');

var client = require('./client');
var configuration = require('./configure.js');
var utils = require('./utils');

var token_persist = {};

var configure = exports.configure = function configure(options) {
    if (options !== undefined && typeof options === 'object') {
        configuration.default_options = utils.merge(configuration.default_options, options);
    }
};

var login = exports.login = function (config, cb) {
    if (typeof config === "function") {
	cb = config;
	config = configuration.default_options;
    } else if (!config) {
	config = configuration.default_options;
    } else {
	config = utils.merge(config, configuration.default_options);
    }
    
    var payload = querystring.stringify({
	    grant_type: "client_credentials",
        client_id: config.client_id,
        client_secret: config.client_secret
    });
    
    var http_options = {
        schema: config.schema || configuration.default_options.schema,
        host: config.host || configuration.default_options.host,
        port: config.port || configuration.default_options.port,
        headers: {            
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    
    client.invoke('POST', '/api/Token', payload, http_options, function (err, res) {
        var token = null;
        
        if (res) {
            var seconds = new Date().getTime() / 1000;
            token_persist[config.username] = res;
            token_persist[config.username].created_at = seconds;
            token = res;            
        }
	
        cb(err, token);
    });
};

function updateToken(http_options, error_callback, callback) {
    login(http_options, function (error, token) {
        if (error) {
            error_callback(error, token);
        } else {
            http_options.headers.Authorization = "Bearer " + token.access_token;
            callback();
        }
    });
}

var executeHttp = exports.executeHttp = function executeHttp(http_method, path, data, http_options, cb) {
    if (typeof http_options === "function") {
        cb = http_options;
        http_options = null;
    }
    if (!http_options) {
        http_options = configuration.default_options;
    } else {
        http_options = utils.merge(http_options, configuration.default_options);
    }
    
    function retryInvoke() {
        client.invoke(http_method, path, data, http_options, cb);
    }
    
    if (http_options.username in token_persist && !utils.checkExpiredToken(token_persist[http_options.username]) && !http_options.refresh_token) {
        
        http_options.headers.Authorization = "Bearer " + token_persist[http_options.username].access_token;
	
        client.invoke(http_method, path, data, http_options, function (error, response) {
            if (error && error.httpStatusCode === 401 && http_options.username && http_options.headers.Authorization) {
                http_options.headers.Authorization = null;
                updateToken(http_options, cb, retryInvoke);
            } else {
                cb(error, response);
            }
        });
    } else {
        updateToken(http_options, cb, retryInvoke);
    }
};