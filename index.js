/*
* Primary file for Hello World API
*
*/

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res){

	// Get the URL and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as object
	var queryStringObject = parsedUrl.query;

	// Get the HTTP Method
	var method = req.method.toUpperCase();

	// Get the headers as an object
	var headers = req.headers;

	// Get the payload, if any. JSON
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		// Append decoded data to buffer
		buffer += decoder.write(data);
	});

	req.on('end', function(){
		buffer += decoder.end();

		// Choose the handler this request should go to. If one is not foud then 404
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to send to the handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};

		// Route request to the handler specified in the router
		chosenHandler(data,function(statusCode,payload){
			// Use the status code callback by the handler or use 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			// Use the payload called back by handler, or default to empty object
			payload = typeof(payload) == 'object' ? payload : {};

			// convert the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			
			// Log the request path
			console.log("Response", statusCode, payloadString);

		});
	});
});

// Start the http server 
httpServer.listen(config.httpPort, function(){
	console.log("The server is listening on port "+config.httpPort+" in "+config.envName+" mode")
});

// Define the handlers / routes
var handlers = {};

// ping handler 
handlers.hello = function(data,callback){
	callback(200,{
		'welcomeMessage' : 'Hello, welcome to the Hello World API!'
	});
};

// No found handler
handlers.notFound = function(data,callback){
	callback(404);
};

// Define our request router
var router = {
	'hello' : handlers.hello
};