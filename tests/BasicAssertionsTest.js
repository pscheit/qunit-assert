define(['qunit-assert'], function (t) {
  
  module("Basic Assertions");

  var setup = function (test) {
    /* this setup replaces the real QUnit with a QUnit-Mock */
    var stack = [];

    var QUnitMock = function () {

      this.push = function(result, actual, expected, message) {
        stack.push({
          result: result,
          actual: actual,
          expected: expected,
          message: message
        });
      };

      this.pushFailure = function(message) {
        stack.push({
          result: false,
          message: message
        });
      };

      this.ok = function(result, message) {
        stack.push({
          result: result,
          message: message
        });
      };

      this.equiv = function() {
        return QUnit.equiv.apply(arguments);
      };

      this.jsDump = {
        parse: function(obj) {
          return QUnit.jsDump.parse(obj);
        }
      };
    };

    // inject
    t.boundQUnit = new QUnitMock();

    return t.setup(test, {
      assertPushedLength: function (length) {
        QUnit.equal(stack.length, length, length+' assertions were pushed');
      },
      getPushed: function(index) {
        return stack[index];
      },

      assertPushed: function (index, result, message) {
        var pushed = this.getPushed(index);

        QUnit.equal(result, pushed.result, "pushed result does not equal");

        if (arguments.length >= 3) {
          QUnit.equal(message, pushed.message, "pushed message does not equal");
        }
      }
    });
  };

  test("fail pushes a failure to QUnit", function () {
    var that = setup(this);

    that.fail("this is the message");
    
    that.assertPushedLength(1);
    that.assertPushed(0, false, "failed: this is the message");
  });

  test("ok pushes a success to QUnit", function() {
    var that = setup(this);

    that.ok("this is the ok message");

    that.assertPushedLength(1);
    that.assertPushed(0, true, "this is the ok message");
  });

  test("assertEquals works like equal()", function () {
    var that = setup(this);

    var equations = [
      [true, true],
      ["string", "string"],
      [1, 1],
      [true, 1]
    ];

    for (var i = 0; i < equations.length; i++) {
      QUnit.equal(equations[i][1], equations[i][0], 'equation #'+i);
      that.assertEquals(equations[i][1], equations[i][0], 'equation #'+i);
    }
  });

  test("assertTrue checks if a value is boolean true", function () {
    var that = setup(this);

    that.assertTrue(true, "true is true");
    that.assertTrue(false, "false is true");

    that.assertPushedLength(2);
    that.assertPushed(0, true, "asserted that true is true");
    that.assertPushed(1, false, "failed asserting that false is true");
  });

  test("assertFalse checks if a value is boolean false", function () {
    var that = setup(this);

    that.assertFalse(false, "false is false");
    that.assertFalse(true, "true is false");

    that.assertPushedLength(2);
    that.assertPushed(0, true, "asserted that false is false");
    that.assertPushed(1, false, "failed asserting that true is false");
  });

  test("assertType checks if a value is from type- positives", function () {
    var that = setup(this);

    var conditions = [
      ["string", "a string"],
      ["number", 7],
      ["integer", 7],
      ["object", {}],
      ["array", []],
      ["float", 0.93],
      ["object", []],
      ["boolean", true],
      ["boolean", false]
    ];

    for (var i = 0; i < conditions.length; i++) {
      that.assertType(conditions[i][0], conditions[i][1]);

      that.assertPushed(i, true);
    }
  });

  test("assertType checks if a value is from type- negatives", function () {
    var that = setup(this);

    var conditions = [
      ["blubb", "a string"],
      ["float", 7],
      ["integer", 0.93],
      ["array", {}],
      ["boolean", 1],
      ["boolean", 0],
      ["boolean", undefined]
    ];

    for (var i = 0; i < conditions.length; i++) {
      that.assertType(conditions[i][0], conditions[i][1], 'conditions #'+i);

      that.assertPushed(i, false);
    }
  });

  test("emptyObject tests if the actual is an empty object without properties", function () {
    var that = setup(this);

    that.assertEmptyObject({});
    that.assertPushed(0, true);

    that.assertEmptyObject({'notEmpty':'yes'});
    that.assertPushed(1, false);
  });

  test("isInstanceOf asserts constructor of object instances", function() {
    var that = setup(this);
    var Something = function () { this.prop = 'value'; };
    var e = new Error('wuah');
    var o = {};
    var a = [];
    
    var positiveValues = [
      [e, Error],
      [new Something(), Something]
    ];
    
    var negativeValues = [
      [e, Something],
      [{ most: 'important' }, Something],
      [a, Error],
      [o, Error]
    ];

    var failingValues = [
      ['eins', Error],
      [7, Error]
    ];
    
    var data;
    for (var i = 0; i < positiveValues.length; i++) {
      data = positiveValues[i];
      that.assertInstanceOf(data[1], data[0], that.debug(data[0])+" isInstanceof "+that.debug(data[1]));
      that.assertPushed(i, true);
    }

    for (i = 0; i < negativeValues.length; i++) {
      data = negativeValues[i];
      that.assertInstanceOf(data[1], data[0], that.debug(data[0])+" isInstanceof "+that.debug(data[1]));
      that.assertPushed(i+positiveValues.length, false);
    }

    for (i = 0; i < failingValues.length; i++) {
      data = failingValues[i];

      try {
        that.assertInstanceOf(data[1], data[0], that.debug(data[0])+" isInstanceof "+that.debug(data[1]));

        that.fail('no error thrown');
      } catch (ex) {
        that.ok("error was thrown");
      }
    }
  });
});