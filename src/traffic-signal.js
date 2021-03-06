var _ = require('lodash');

var b = require('bonescript');

function TrafficSignal(signalToPinMapping) {
  if (!_(signalToPinMapping).isPlainObject()) {
    throw new Error('must provide a signal to pin mapping object');
  }

  if (_(signalToPinMapping).isEmpty()) {
    throw new Error('signal to pin mapping must contain at least one mapping');
  }

  this.signalToPinMapping = signalToPinMapping;
}

TrafficSignal.prototype.init = function() {
  _.forOwn(this.signalToPinMapping, function(pin, signal) {
    b.pinMode(pin, b.OUTPUT);
  });
};

TrafficSignal.prototype.set = function(signal, power) {
  if (!_(signal).isString()) {
    throw new Error('must provide at least signal name');
  }

  if (!_(this.signalToPinMapping).has(signal)) {
    throw new Error('signal ' + signal + ' not available');
  }

  if (_(power).isUndefined()) {
    b.digitalWrite(this.signalToPinMapping[signal], b.HIGH);
  } else {
    b.digitalWrite(this.signalToPinMapping[signal], power ? b.HIGH : b.LOW);
  }
};

TrafficSignal.prototype.play = function(frames) {
  if (!_.isArray(frames)) {
    throw new Error('must provide an array of signal states');
  }

  var thiz = this; // FIXME use lodash thisArg binding
  _.forEach(frames, function(frame) {
    _.forOwn(frame, function(power, signal) {
      thiz.set(signal, power);
    });
  });
};

module.exports = {
  // TODO does prop need to be in quotes?
  'TrafficSignal': TrafficSignal
};
