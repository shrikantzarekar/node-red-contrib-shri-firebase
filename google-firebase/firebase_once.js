module.exports = function (RED) {
  var firebase = require('firebase');
  var Utils = require('./utils/utils');

  function FirebaseOnce(n) {
    RED.nodes.createNode(this, n);
    this.firebaseConfig = RED.nodes.getNode(n.firebaseConfig);
    this.childpath = n.childpath;
    this.eventType = n.eventType;
    this.activeRequests = [];
    this.ready = false;
    var node = this;

    if (!this.firebaseConfig) {
      this.status({ fill: "red", shape: "ring", text: "invalid credentials" })
      this.error('You need to setup Firebase credentials!');
      return;
    }

    this.status({ fill: "green", shape: "ring", text: "Connected" })
    if (this.firebaseConfig.fbConfig.fbApp) {
      firebase.database().ref(this.childpath).once(this.eventType.toString()).then(function (snapshot) {
        var msg = {};
        msg.payload = snapshot.val();
        node.send(msg);
        node.status({ fill: "green", shape: "ring", text: "Received Data(Once) at " + Utils.getTime() });
      });
    }

    this.validEventTypes = {
      "value": true,
      "child_added": true,
      "child_changed": true,
      "chiled_removed": true,
      "child_moved": true
    };
  }
  RED.nodes.registerType('google.firebase.once', FirebaseOnce);
};
