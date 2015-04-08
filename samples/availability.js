"use strict";

var api = require('../index')
var sample_options = require('./sample-config').sample_options;

api.configure(sample_options);

var request = {
	"ClientId": sample_options.client_id,
	"TripComponents":[
	{
		"DepartCity":"JFK",
		"ArriveCity":"LHR",
		"AirDate":"14Jun15",
		"TripDirection":"OUTBOUND_TRIP",
	},
	{
		"DepartCity":"LHR",
		"ArriveCity":"JFK",
		"AirDate":"21Jun15",
		"TripDirection":"RETURN_TRIP",
	}],
	"Options":
	{
		"BookingType":"AirSea",
	}
};


api.availability.search(request, function (err, response) {
	if (err) {
		//  error
		console.log('ERROR: ' + err)
		return;	
	}

	console.log('RESPONSE: ' + JSON.stringify(response))
});