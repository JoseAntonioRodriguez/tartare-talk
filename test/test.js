'use strict';

var tartare = require('tartare');
var request = require('request');
var expect = require('chai').expect;


feature('Get users using the API', 'I am able to use the Users API to read the users of the SUT', function() {
  scenario('Get a user that exists in the SUT', function() {
    var user = {
      name: 'john',
      email: 'john@doe.com'
    };
    var response;

    given('there is a user with username john in the SUT', function(done) {
      request.post('http://localhost:8080/users', { body: user, json: true }, done);
    });
    when('I use the API to get the user looking up by his name', function(done) {
      request.get('http://localhost:8080/users/john', { json: true }, function(err, res) {
        if (err) {
          return done(err);
        }
        response = res;
        done();
      });
    });
    then('I get a 200 OK HTTP Status Code', function() {
      expect(response.statusCode).to.equal(200);
      expect(response).to.have.httpStatusCode(200);
    });
    and('the HTTP body has the expected user data', function() {
      expect(response.body).to.deep.equal(user);
    });
  });
});
