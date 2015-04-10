"use strict";

var api = require('../api');

function booking() {
    var baseURL = '/api/FlightBooking';    
    
    var ret = {
        baseURL: baseURL,
	
        book: function book(data, config, cb) {
            api.executeHttp('POST', this.baseURL, data, config, cb);
        },
	
        getPNR: function getPNR (data, config, cb) {
            api.executeHttp('POST', this.baseURL + '/GetPnr', data, config, cb);
        },
	
        cancelPNR: function cancelPNR (data, config, cb) {
            api.executeHttp('POST', this.baseURL + '/Cancel', data, config, cb);
        }
    };
    
    return ret;
}

module.exports = booking;