"use strict";

var api = require('../api');

function avail() {
    var baseURL = '/api/FlightAvailability';    

    var ret = {
        baseURL: baseURL,

        search: function search(data, config, cb) {
            api.executeHttp('POST', this.baseURL, data, config, cb);
        },

        more: function more (data, config, cb) {
        	api.executeHttp('POST', this.baseURL + '/More', data, config, cb);
        },

        selectFlight: function selectFlight (data, config, cb) {
            api.executeHttp('POST', this.baseURL + '/SelectFlight', data, config, cb);
        },

        priceUpsell: function priceUpsell (data, config, cb) {
        	api.executeHttp('POST', this.baseURL + '/PriceUpsell', data, config, cb);
        }
    };
    
    return ret;
}

module.exports = avail;