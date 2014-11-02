'use strict';

var http = require('http')
  , url = require('url')
  ;

var HTTP_PORT = 8080;

var usersCollection = {};


function requestHandler(req, res) {
  var parsedUrl = url.parse(req.url);

  if (/^\/users\/?$/.test(parsedUrl.pathname)) {
    // Resource: /users
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end();
    }
    if (parsedUrl.query) {
      res.writeHead(400);
      return res.end();
    }
    if (!req.headers['content-type'] || req.headers['content-type'].split(';')[0] !== 'application/json') {
      res.writeHead(415);
      return res.end();
    }

    // Creating a new user
    var body = '';
    req.on('error', function(err) {
      res.writeHead(500);
      return res.end();
    });
    req.on('data', function(chunk) {
      body += chunk.toString();
    });
    req.on('end', function() {
      var user;
      try {
        user = JSON.parse(body);
      } catch(err) {
        res.writeHead(400);
        return res.end();
      }
      if (!user.name || !user.email) {
        res.writeHead(400);
        return res.end();
      }
      usersCollection[user.name] = user;
      res.writeHead(201);
      // Simulate some processing time
      return setTimeout(function() {
        res.end();
      }, 200);
    });

  } else if (/^\/users\/[^\/]+\/?$/.test(parsedUrl.pathname)) {
    // Resource: /users/{username}
    if ([ 'GET', 'DELETE' ].indexOf(req.method) === -1) {
      res.writeHead(405);
      return res.end();
    }
    if (parsedUrl.query) {
      res.writeHead(400);
      return res.end();
    }
    var username = parsedUrl.pathname.split('/')[2];

    // Getting a user
    if (req.method === 'GET') {
      if (!usersCollection[username]) {
        res.writeHead(404);
        return res.end();
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      // Simulate some processing time
      return setTimeout(function() {
        res.end(JSON.stringify(usersCollection[username], null, 2));
      }, 200);
    }

    // Deleting a user
    if (req.method === 'DELETE') {
      if (!usersCollection[username]) {
        res.writeHead(404);
        return res.end();
      }
      delete usersCollection[username];
      res.writeHead(204);
      // Simulate some processing time
      return setTimeout(function() {
        res.end();
      }, 200);
    }

  } else {
    res.writeHead(404);
    return res.end();
  }
}

http.createServer(requestHandler)
  .on('error', function onError(err) {
    console.error('Server ERROR:');
    console.error(err);
    process.exit(1);
  })
  .on('listening', function onListening() {
    console.log('Server listening on port', HTTP_PORT);
  })
  .listen(HTTP_PORT, 'localhost');
