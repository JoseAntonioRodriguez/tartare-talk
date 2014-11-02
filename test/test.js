'use strict';

var tartare = require('tartare');
var request = require('request');
var expect = require('chai').expect;

var steps = require('./steps');
tartare.synchronize(steps);

feature('Get users using the API', 'I am able to use the Users API to read the users of the SUT', function() {
  beforeFeature(function() {
    steps.startServer();
  });

  var dataset = [
    { desc: 'John', user: { name: 'john', email: 'john@doe.com' } },
    { skip: true, desc: 'Alice', user: { name: 'alice', email: 'alice@doe.com' } }
  ];
  scenario.only('Get a user that exists in the SUT', dataset, function(variant) {
    var response;

    given('there is a user with username ' + variant.desc + ' in the SUT', function(done) {
      request.post('http://localhost:8080/users', { body: variant.user, json: true }, done);
    });
    when('I use the API to get the user looking up by his name', function() {
      response = steps.getUser(variant.user.name);
    });
    then('I get a 200 OK HTTP Status Code', function() {
      expect(response).to.have.httpStatusCode(200);
    });
    and('the HTTP body has the expected user data', function() {
      expect(response.body).to.deep.equal(variant.user);
    });
  });

  afterFeature(function() {
    steps.stopServer();
  });
});


feature('Switch on and off the device', function() {
  scenario('Switch on the device', function() {
    given('the device is switched off');
    when('I press the switch on button');
    then('the device is up & running');
  });
});
