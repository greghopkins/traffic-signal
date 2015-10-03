var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var b = require('bonescript');
var TrafficSignal = require('../src/traffic-signal').TrafficSignal;

describe('Traffic Signal', function() {

  var mapping = {
    red: 'P8_25',
    yellow: 'P8_24',
    green: 'P8_5'
  };

  describe('constructor', function() {
    it('should be a function', function() {
      expect(TrafficSignal).to.be.a('function');
    });

    it('should throw if a mapping object not provided', function() {
      expect(function() {
        new TrafficSignal();
      }).to.throw('must provide a signal to pin mapping');
    });

    it('should throw if mapping object is empty', function() {
      expect(function() {
        new TrafficSignal({});
      }).to.throw('signal to pin mapping must contain at least one mapping');
    });

    it('should not throw if proper mapping object provided', function() {
      expect(function() {
        new TrafficSignal({
          foo: 'pin 1',
          bar: 'pin 2',
          baz: 'pin 3'
        });
      }).not.to.throw();
    });
  });

  describe('init()', function() {
    beforeEach(function() {
      sinon.spy(b, 'pinMode');
    });

    beforeEach(function() {
      this.trafficSignal = new TrafficSignal(mapping);
      this.trafficSignal.init();
    });

    it('should set the pin mode on signal pins to b.OUTPUT', function() {
      this.trafficSignal.init(); // redundant, but not dangerous

      expect(b.pinMode).to.have.been.calledWith(mapping.red, b.OUTPUT);
      expect(b.pinMode).to.have.been.calledWith(mapping.yellow, b.OUTPUT);
      expect(b.pinMode).to.have.been.calledWith(mapping.green, b.OUTPUT);
    });

    afterEach(function() {
      b.pinMode.restore();
    });
  });

  describe('other instance functions', function() {
    beforeEach(function() {
      this.trafficSignal = new TrafficSignal(mapping);
      this.trafficSignal.init();
    });

    describe('set()', function() {
      beforeEach(function () {
        sinon.spy(b, 'digitalWrite');
      });

      it('should throw if pin and power state are not provided', function() {
        var thiz = this;
        expect(function() {
          thiz.trafficSignal.set();
        }).to.throw('must provide at least signal name');
      });

      it('should throw if the signal is not found', function () {
        var thiz = this;
        expect(function () {
          thiz.trafficSignal.set('foo', true);
        }).to.throw('signal foo not available');
      });

      it('should pull pin high when power state truthy', function() {
        this.trafficSignal.set('red', true);

        expect(b.digitalWrite).to.have.been.calledWith(mapping.red, b.HIGH);
      });

      it('should pull pin low when power state falsy', function() {
        this.trafficSignal.set('green', false);

        expect(b.digitalWrite).to.have.been.calledWith(mapping.green, b.LOW);
      });

      it('should treat no power state as true and pull HIGH', function () {
        this.trafficSignal.set('yellow');

        expect(b.digitalWrite).to.have.been.calledWith(mapping.yellow, b.HIGH);
      });

      afterEach(function () {
        b.digitalWrite.restore();
      });
    });
  });

});
