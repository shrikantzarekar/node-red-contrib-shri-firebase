module.exports = function (RED) {
  var firebase = require('firebase');
  var events = require("events");
  var path = require("path");
  var https = require("follow-redirects").https;
  var urllib = require("url");

  var connectionPool = function () {
    var connections = [];
    var isInitialized = false;
    var mainApp = {};

    return {
      get: function (config, configNodeID) {
        if (isInitialized) {
          return mainApp;
        } else {
          isInitialized = true;
          var _emitter = new events.EventEmitter();
          var _emit = function (a, b) {
            if (this.lastEvent == a && this.lastEventData == b) {
              return;
            }
            this.lastEvent = a;
            this.lastEventData = b;

            _emitter.emit(a, b)
          };

          mainApp = {
            fbApp: firebase.initializeApp(config),
            on: function (a, b) { _emitter.on(a, b); },
            once: function (a, b) { _emitter.once(a, b); },
          };
          return mainApp;
        }
      },
    }
  } ();

  function RemoteServerNode(n) {
    RED.nodes.createNode(this, n);

    this.databaseUrl = "https://" + n.databaseUrl + ".firebaseio.com";
    this.authDomain = "https://" + n.authDomain + ".firebaseapp.com";
    this.email = n.email;
    this.password = n.password;
    this.apiKey = n.apiKey;

    if (this.databaseUrl) {
      var config = {
        apiKey: this.apiKey,
        authDomain: this.authDomain,
        databaseURL: this.databaseUrl
      };
      
      //Shrikant
      this.auth = firebase.auth();
      this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
      this.auth.signInWithEmailAndPassword(this.email,this.password);
      

      this.fbConfig = connectionPool.get(config, this.id);
    } else {
      this.log('Firebase Not configured!!');
    }
  }

  RED.nodes.registerType("google-firebase-config", RemoteServerNode);
};


///
/*
this.auth = firebase.auth();
this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
this.auth.signInWithEmailAndPassword(email,password);
*/