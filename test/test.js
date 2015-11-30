"use strict";

var chai = require('chai');
chai.config.includeStack = true;

var shallowDeepAlmostEqual = require('../chai-shallow-deep-almost-equal');
chai.use(shallowDeepAlmostEqual);

describe('chai-shallow-deep-almost-equal', function() {

    chai.use(function (chai, utils) {
        var inspect = utils.objDisplay;

        chai.Assertion.addMethod('fail', function (message) {
            var obj = this._obj;

            new chai.Assertion(obj).is.a('function');

            try {
                obj();
            } catch (err) {
                this.assert(
                        err instanceof chai.AssertionError
                    , 'expected #{this} to fail, but it threw ' + inspect(err));
                this.assert(
                        err.message === message
                    , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
                return;
            }

            this.assert(false, 'expected #{this} to fail');
        });
    });

    it('success on scalar values', function() {
        new chai.Assertion(true).to.be.shallowDeepAlmostEqual(true);
        new chai.Assertion(10).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion('success').to.be.shallowDeepAlmostEqual('success');
    });

    it('success on floats', function() {
        new chai.Assertion(10).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(10.001).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(10.0001).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(10.00001).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(9.999).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(9.9991).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(9.99901).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(9.9999).to.be.shallowDeepAlmostEqual(10);
        new chai.Assertion(9.99999).to.be.shallowDeepAlmostEqual(10);
    });

    it('fail on floats', function() {
        new chai.Assertion(function() {
            new chai.Assertion(10.1).to.be.shallowDeepAlmostEqual(10);
        }).fail('Expected to have "10+-0.001" but got "10.1" at path "/".');
        new chai.Assertion(function() {
            new chai.Assertion(9.9).to.be.shallowDeepAlmostEqual(10);
        }).fail('Expected to have "10+-0.001" but got "9.9" at path "/".');
    });

    it('fail on scalar values', function() {
        new chai.Assertion(function() {
            new chai.Assertion(true).to.be.shallowDeepAlmostEqual(false);
        }).fail('Expected to have "false" but got "true" at path "/".');

        new chai.Assertion(function() {
            new chai.Assertion(10).to.be.shallowDeepAlmostEqual(42);
        }).fail('Expected to have "42+-0.001" but got "10" at path "/".');

        new chai.Assertion(function() {
            new chai.Assertion('success').to.be.shallowDeepAlmostEqual('fail');
        }).fail('Expected to have "fail" but got "success" at path "/".');
    });

    it('success on empty objects', function() {
        new chai.Assertion({}).to.be.shallowDeepAlmostEqual({});
    });

    it('success on empty array', function() {
        new chai.Assertion([]).to.be.shallowDeepAlmostEqual([]);
    });

    it('success on simple objects', function() {
        new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepAlmostEqual({a: 10});
    });

    it('fail on simple objects', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepAlmostEqual({a: 11});
        }).fail('Expected to have "11+-0.001" but got "10" at path "/a".');
    });

    it('success on array', function() {
        new chai.Assertion([10,11,12]).to.be.shallowDeepAlmostEqual([10,11]);
    });

    it('fail on array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([10,11,12]).to.be.shallowDeepAlmostEqual([13]);
        }).fail('Expected to have "13+-0.001" but got "10" at path "/0".');
    });

    it('success on deep objects', function() {
        new chai.Assertion({a: {b: 12, c: 15}}).to.be.shallowDeepAlmostEqual({a: {b: 12}});
    });

    it('fail on deep objects', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: {b: 12, c: 15}}).to.be.shallowDeepAlmostEqual({a: {b: 13}});
        }).fail('Expected to have "13+-0.001" but got "12" at path "/a/b".');
    });

    it('success on deep array', function() {
        new chai.Assertion([{b: 12, c: 15}]).to.be.shallowDeepAlmostEqual([{b: 12}]);
    });

    it('fail on deep array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([{b: 12, c: 15}]).to.be.shallowDeepAlmostEqual([{b: 13}]);
        }).fail('Expected to have "13+-0.001" but got "12" at path "/0/b".');
    });

    it('success on using object as array', function() {
        new chai.Assertion([{b: 12}, {c: 15}]).to.be.shallowDeepAlmostEqual({length: 2, 0: {b: 12}});
    });

    it('fail on using object as array', function() {
        new chai.Assertion(function() {
            new chai.Assertion([{b: 12}, {c: 15}]).to.be.shallowDeepAlmostEqual({length: 3});
        }).fail('Expected to have "3+-0.001" but got "2" at path "/length".');
    });

    it('success on accessors', function() {
        function test() { }
        Object.defineProperty(test.prototype, 'a', {
            get: function() {
                return 'b';
            }
        });

        new chai.Assertion(new test()).to.be.shallowDeepAlmostEqual({ a: 'b' });
    });

    it('success on dates', function() {
        new chai.Assertion(new Date("2014-09-30T20:00:00.000Z"))
            .to.be.shallowDeepAlmostEqual(new Date("2014-09-30T20:00:00.000Z"));
    });

    it('fail on dates', function() {
        new chai.Assertion(function() {
            new chai.Assertion(new Date('2014-09-30T20:00:00.000Z'))
                .to.be.shallowDeepAlmostEqual(new Date('2014-09-29T20:00:00.000Z'));
        }).fail(
            'Expected to have date "2014-09-29T20:00:00.000Z" but got "2014-09-30T20:00:00.000Z" at path "/".'
        );
    });

    it('fail on comparsion date with non-date', function() {
      new chai.Assertion(function() {
          new chai.Assertion(42)
              .to.be.shallowDeepAlmostEqual(new Date('2014-09-29T20:00:00.000Z'));
      }).fail(
          'Expected to have date "2014-09-29T20:00:00.000Z" but got "42" at path "/".'
      );
    });

    it('success on missing properties', function() {
        new chai.Assertion({a: 10}).to.be.shallowDeepAlmostEqual({a: 10, b: undefined});
    });

    it('success on null properties', function() {
        new chai.Assertion({a: 10, b: null}).to.be.shallowDeepAlmostEqual({a: 10, b: null});
    });

    it('fail on missing properties', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepAlmostEqual({a: 10, b: undefined});
        }).fail('Expected to have undefined but got "12" at path "/b".');
    });

    it('fail on null properties', function() {
        new chai.Assertion(function() {
            new chai.Assertion({a: 10, b: 12}).to.be.shallowDeepAlmostEqual({a: 10, b: null});
        }).fail('Expected to have null but got "12" at path "/b".');
    });

    it('success on null', function() {
        new chai.Assertion(null).to.be.shallowDeepAlmostEqual(null);
    });

    it('success on undefined', function() {
        var a = {};
        new chai.Assertion(a.unknown).to.be.shallowDeepAlmostEqual(undefined);
    });

    it('success on undefined sub-field', function() {
        var a = {};
        new chai.Assertion(a).to.be.shallowDeepAlmostEqual({b: undefined});
    });

    it('fail on undefined sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: null };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({b: undefined});
        }).fail('Expected to have undefined but got "null" at path "/b".');
    });

    it('fail on undefined array sub-field', function() {
        new chai.Assertion(function() {
            var a = { };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({ b: [ ] });
        }).fail('Expected "b" field to be defined at path "/".');
    });

    it('fail on undefined item in array', function() {
        new chai.Assertion(function() {
            var a = { b: [ ] };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({ b: [ { c: 'hello' } ] });
        }).fail('Expected "0" field to be defined at path "/b".');
    });

    it('fail on null', function() {
        new chai.Assertion(function() {
            new chai.Assertion(23).to.be.shallowDeepAlmostEqual(null);
        }).fail('Expected to have null but got "23" at path "/".');
    });

    it('fail on undefined', function() {
        new chai.Assertion(function() {
            new chai.Assertion(23).to.be.shallowDeepAlmostEqual(undefined);
        }).fail('Expected to have undefined but got "23" at path "/".');
    });

    it('fail on null sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: 'abc' };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({b: null});
        }).fail('Expected to have null but got "abc" at path "/b".');
    });

    it('fail on null array sub-field', function() {
        new chai.Assertion(function() {
            var a = { b: null };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({ b: [ ] });
        }).fail('Expected to have an array/object but got null at path "/b".');
    });

    it('fail on null item in array', function() {
        new chai.Assertion(function() {
            var a = { b: [ null ] };
            new chai.Assertion(a).to.be.shallowDeepAlmostEqual({ b: [ { c: 'hello' } ] });
        }).fail('Expected to have an array/object but got null at path "/b/0".');
    });

    it('fail on unexisting array', function() {
        new chai.Assertion(function() {
            new chai.Assertion(null).to.be.shallowDeepAlmostEqual(['a']);
        }).fail('Expected to have an array/object but got null at path "/".');
    });

});
