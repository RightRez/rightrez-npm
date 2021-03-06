"use strict";

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var configuration = require('./configure');

var invoke = exports.invoke = function invoke(http_method, path, data, http_options_param, cb) {
    var client = (http_options_param.schema === 'http') ? http : https;
    
    var request_data = data;
    
    if (http_method === 'GET') {
        //format object parameters into GET request query string
        if (typeof request_data !== 'string') {
            request_data = querystring.stringify(request_data);
        }
        if (request_data) {
            path = path + "?" + request_data;
            request_data = "";
        }
    } else if (typeof request_data !== 'string') {
        request_data = JSON.stringify(request_data);
    }
    
    var http_options = {};
    
    if (http_options_param) {
	
        http_options = JSON.parse(JSON.stringify(http_options_param));
	
        if (!http_options.headers) {
            http_options.headers = {};
        }
        http_options.path = path;
        http_options.method = http_method;
        if (request_data) {
            http_options.headers['Content-Length'] = Buffer.byteLength(request_data, 'utf-8');
        }
	
        if (!http_options.headers['Accept']) {
            http_options.headers['Accept'] = 'application/json';
        }
	
        if (!http_options.headers['Content-Type']) {
            http_options.headers['Content-Type'] = 'application/json';
        }
	
        if (configuration.userAgent) {
            http_options.headers['User-Agent'] = configuration.userAgent;
        }
    }
    
    var req = client.request(http_options);
    
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        cb(e, null);
    });
    
    req.on('response', function (res) {
        var response = '';
        res.setEncoding('utf8');
	
        res.on('data', function (chunk) {
            response += chunk;
        });
	
        res.on('end', function () {
            var err = null;
	    
            try {
                //Set response to be parsed JSON object if data received is json
                //expect that content-type header has application/json when it
                //returns data
                if (typeof res.headers['content-type'] === "string" &&
                    res.headers['content-type'].match(/^application\/json(?:;.*)?$/) !== null) {
                    response = JSON.parse(response);
		}
                //Set response to an empty object if no data was received
                if (response === '') {
                    response = {};
                }
                response.httpStatusCode = res.statusCode;
		
            } catch (e) {
                err = new Error('Invalid JSON Response Received');
                err.error = {
                    name: 'Invalid JSON Response Received, JSON Parse Error'
                };
                // response contains the full json description of the error
                // that PayPal returns and information link
                err.response = response;
                err.httpStatusCode = res.statusCode;
                response = null;
            }
	    
            if (!err && (res.statusCode < 200 || res.statusCode >= 300)) {
                err = new Error('Response Status : ' + res.statusCode);
                err.response = response;
                if (process.env.NODE_ENV === 'development') {
                    err.response_stringified = JSON.stringify(response);
                }
                err.httpStatusCode = res.statusCode;
                response = null;
            }
	    
            cb(err, response);
        });
    });
    
    if (request_data) {
        req.write(request_data);
    }
    
    req.end();
};
