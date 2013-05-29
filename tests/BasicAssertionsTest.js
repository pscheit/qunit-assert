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

        QUnit.equal(result, pushed.result);

        if (arguments.length >= 3) {
          QUnit.equal(message, pushed.message);
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

    that.ok(true, "this is the ok message");

    that.assertPushedLength(1);
    that.assertPushed(0, true, "this is the ok message");
  });
});