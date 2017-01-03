module.exports = function (RED) {
  var firebase = require('firebase');
  var Utils = require('./utils/utils');
  var _ = require('lodash-node');

  function FirebasePush(n) {
    RED.nodes.createNode(this, n);
    this.firebaseConfig = RED.nodes.getNode(n.firebaseConfig);
    this.childpath = n.childpath;
    this.activeRequests = [];
    this.ready = false;
    var node = this;

    if (!this.firebaseConfig) {
      this.status({ fill: "red", shape: "ring", text: "invalid credentials" })
      this.error('You need to setup Firebase credentials!');
      return;
    }

    this.status({ fill: "green", shape: "ring", text: "Connected" });
    this.on('input', function (msg) {
      if (this.firebaseConfig.fbConfig.fbApp) {
        msg.key = firebase.database().ref(this.childpath).push(msg.payload).key;
        node.status({ fill: "green", shape: "ring", text: "Pushed Data at " + Utils.getTime() });
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType('shri.firebase.push', FirebasePush);
};
