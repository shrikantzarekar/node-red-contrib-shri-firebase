var _ = require('lodash-node');
var moment = require('moment');

exports.getTime = function () {
  return moment().format("HH:mm");
};