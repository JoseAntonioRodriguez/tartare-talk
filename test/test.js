'use strict';

var tartare = require('tartare');
var request = require('request');
var expect = require('chai').expect;

var steps = require('./steps');
tartare.synchronize(steps);

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
    when('I use the API to get the user looking up by his name', function() {
      response = steps.getUser('john');
    });
    then('I get a 200 OK HTTP Status Code', function() {
      expect(response).to.have.httpStatusCode(200);
    });
    and('the HTTP body has the expected user data', function() {
      expect(response.body).to.deep.equal(user);
    });
  });
});
