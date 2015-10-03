var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

var Promise = require("bluebird");

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
      }).to.throw('must provide a signal to pin mapping object');
    });

    it('should throw if mapping object is empty', function() {
      expect(function() {
        new TrafficSignal({});
      }).to.throw('signal to pin mapping must contain at least one mapping');
    });

    it('should not throw if proper mapping object provided', function() {
      expect(function() {
        new TrafficSignal(mapping);
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
      beforeEach(function() {
        sinon.spy(b, 'digitalWrite');
      });

      it('should return a promise', function () {
        // TODO is there another way, aside from a poor-man's check
        expect(this.trafficSignal.set('red', true).then).to.not.be.undefined;
      });

      it('should throw if pin and power state are not provided', function() {
        var thiz = this;
        expect(function() {
          thiz.trafficSignal.set();
        }).to.throw('must provide at least signal name');
      });

      it('should throw if the signal is not found', function() {
        var thiz = this;
        expect(function() {
          thiz.trafficSignal.set('foo', true);
        }).to.throw('signal foo not available');
      });

      it.only('should pull pin high when power state truthy', function(done) {
        this.trafficSignal.set('red', true).then(function () {
          expect(b.digitalWrite).to.have.been.calledWith(mapping.red, b.HIGH);
        }, function (err) {
          done(err);
        });
      });

      it('should pull pin low when power state falsy', function() {
        this.trafficSignal.set('green', false);

        expect(b.digitalWrite).to.have.been.calledWith(mapping.green, b.LOW);
      });

      it('should treat no power state as true and pull HIGH', function() {
        this.trafficSignal.set('yellow');

        expect(b.digitalWrite).to.have.been.calledWith(mapping.yellow, b.HIGH);
      });

      afterEach(function() {
        b.digitalWrite.restore();
      });
    });

    describe('play()', function() {
      beforeEach(function() {
        sinon.spy(b, 'digitalWrite');
      });

      it('throws if not invoked with an array', function() {
        var thiz = this;
        expect(function() {
          thiz.trafficSignal.play();
        }).to.throw('must provide an array of signal states');
      });

      it('returns a promise', function () {
        // TODO is there another way, aside from a poor-man's check
        expect(this.trafficSignal.play([]).then).to.not.be.undefined;
      });

      it('handles play length of 1', function() {
        this.trafficSignal.play([{
          red: true
        }]);
        expect(b.digitalWrite).to.have.been.calledWith(mapping.red, b.HIGH);
      });

      it('handles play length of 1 with all signals powered', function() {
        this.trafficSignal.play([{
          red: true,
          yellow: true,
          green: true
        }]);

        expect(b.digitalWrite).to.have.been.calledWith(mapping.red, b.HIGH);
        expect(b.digitalWrite).to.have.been.calledWith(mapping.yellow, b.HIGH);
        expect(b.digitalWrite).to.have.been.calledWith(mapping.green, b.HIGH);
      });

      // FIXME this is a terribly fragile test, but it works for now
      it('handles complex ordered playback', function() {
        this.trafficSignal.play([{
          red: true,
          yellow: false,
          green: false
        }, {
          red: false,
          yellow: true,
          green: false
        }, {
          red: false,
          yellow: false,
          green: true
        }]);

        expect(b.digitalWrite.args).to.deep.equal(
          [
            [
              'P8_25',
              1
            ],
            [
              'P8_24',
              0
            ],
            [
              'P8_5',
              0
            ],
            [
              'P8_25',
              0
            ],
            [
              'P8_24',
              1
            ],
            [
              'P8_5',
              0
            ],
            [
              'P8_25',
              0
            ],
            [
              'P8_24',
              0
            ],
            [
              'P8_5',
              1
            ]
          ]);
      });

      describe('with time involved', function() {
        beforeEach(function() {
          this.clock = sinon.useFakeTimers();
        });

        // FIXME this is a terribly fragile test, but it works for now
        it('handles a frame that is numeric, indicating delay in ms', function() {
          this.trafficSignal.play([{
              red: true,
              yellow: false,
              green: true
            },
            1000,
            {
              red: true,
              yellow: true,
              green: false
            }
          ]);

          expect(b.digitalWrite.args).to.deep.equal(
            [
              [
                'P8_25',
                1
              ],
              [
                'P8_24',
                0
              ],
              [
                'P8_5',
                1
              ]
            ]);
          this.clock.tick(1100);
          expect(b.digitalWrite.args).to.deep.equal(
            [
              [
                'P8_25',
                1
              ],
              [
                'P8_24',
                0
              ],
              [
                'P8_5',
                1
              ],
              [
                'P8_25',
                1
              ],
              [
                'P8_24',
                1
              ],
              [
                'P8_5',
                1
              ]
            ]);
        });

        afterEach(function() {
          this.clock.restore();
        });
      });

      afterEach(function() {
        b.digitalWrite.restore();
      });
    });
  });

});
