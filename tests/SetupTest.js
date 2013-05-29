define(['qunit-assert'], function (t) {
  
  module("Setup");

  var setup = function (test) {
    return t.setup({someVar: true});
  };
  
  test("at least all assertions are defined in setup", function () {
    var that = t.setup(this);

    var assertionName, assertions = [
      'assertException',
      'assertEquals',
      'assertSame',
      'assertContains',
      'assertNotSame',
      'assertTrue',
      'assertFalse',
      'assertNotFalse',
      'assertNotUndefined',
      'assertFunction',
      'assertAttributeEquals',
      'assertAttributeNotUndefined',
      'assertLength',
      'assertjQuery',
      'assertjQueryLength',
      'assertjQueryLengthGT',
      'assertjQueryHasClass',
      'assertjQueryHasNotClass',
      'assertjQueryIs',
      'assertjQueryHasWidget',
      'assertHasJooseWidget',
      'fail',
      'ok',
      'assertType',
      'assertEmptyObject',
      'assertInstanceOf',
      'assertDoesRole'
    ];

    for (var f = 0; f < assertions.length; f++) {
      assertionName = assertions[f];

      QUnit.ok($.isFunction(this[assertionName]), "test(this) is extended with assertion: "+assertionName);
      QUnit.ok($.isFunction(that[assertionName]), "returned setup test has assertion: "+assertionName);
    }
  });

  test("t.setup returns this as that", function () {
    var that = t.setup(this);

    QUnit.deepEqual(that, this);
    QUnit.strictEqual(that, this);
    this.assertSame(that, this);
  });

  test("vars are defined from sample setup", function() {
    var that = setup(this);

    QUnit.ok(that.someVar === true, 'someVar is extended');
  });
});