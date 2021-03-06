'use strict';

var fork = require('child_process').fork;
var request = require('request');

var serverPid;

module.exports = {
  startServer: function startServer(cb) {
    serverPid = fork('../src/server', { silent: true }).pid;
    setTimeout(function() {
      cb(null, serverPid);
    }, 1000);
  },
  stopServer: function stopServer(cb) {
    process.kill(serverPid);
    cb();
  }

};
