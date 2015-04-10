# rightrez-npm

A simple node.js package for hooking into RightRez's JSON Web Services API (it's not really RESTful, but it kind of looks RESTful).  

To use:

```
npm install rightrez
```

Then, in your js file:

```
var rightrez = require('rightrez')

rightrez.configure({username: 'YOURUSERNAME', password: 'YOURPASSWORD'})

var request = {
	"ClientId": "YOURCLIENTID"
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
}

rightrez.availability.search(request, function (err, response) {
	if (err) {
		//  error
		console.log('ERROR: ' + err)
		return;
	}

	console.log('RESPONSE: ' + JSON.stringify(response))
})

```

This version only supports avail and booking, but more hooks will be added soon. Full documentation on all JSON endpoints is at https://rightweb.rightrez.com/webapi/help.

# samples

To run samples, set your credentials in samples/sample-config.js and then run the appropriate example from the command line, e.g.

```
node samples/availability.js
```

# dev
If you're working in this repo, please add the following as a pre-commit hook in your .git/hooks directory
```
#!/bin/sh
#
# Checksum of config files that may have client-specific info in
# them, to make sure we don't accidentally check-in real usernames
# or passwords.
#
md5sum -c hash.md5
```

This prevents accidentally checking in local changes to the sample-config.js file.
