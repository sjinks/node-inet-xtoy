const addon = require('bindings')('inet_xtoy');

module.exports.inet_ntop = addon.inet_ntop;
module.exports.inet_pton = addon.inet_pton;
