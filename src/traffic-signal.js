var b = require('bonescript');

function TrafficSignal(signalToPinMapping) {
  if (!signalToPinMapping) {
    throw 'must provide a signal to pin mapping';
  }

  if (Object.getOwnPropertyNames(signalToPinMapping).length === 0) {
    throw 'signal to pin mapping must contain at least one mapping';
  }

  this.signalToPinMapping = signalToPinMapping;
}

TrafficSignal.prototype.init = function() {
  for (var signal in this.signalToPinMapping) {
    b.pinMode(this.signalToPinMapping[signal], b.OUTPUT);
  }
};

TrafficSignal.prototype.set = function (signal, power) {
  if (!signal) {
    throw 'must provide at least signal name';
  }

  if (!this.signalToPinMapping.hasOwnProperty(signal)) {
    throw 'signal ' + signal + ' not available';
  }

  if (typeof power === 'undefined') {
    b.digitalWrite(this.signalToPinMapping[signal], b.HIGH);
  } else {
    b.digitalWrite(this.signalToPinMapping[signal], power ? b.HIGH : b.LOW);
  }

};

module.exports = {
  // TODO does prop need to be in quotes?
  'TrafficSignal': TrafficSignal
};
