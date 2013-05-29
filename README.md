# qunit-assert

More complex assertions for QUnit.  

## introduction

When you've used some of the xUnit de facto standards in testing you were quite frustrated with QUnit. The parameters from actual and expected are twisted and there are not many specialised assertions for the javascript language.  
This library will address this issues. It provides a bunch of new complexer assertions for dom elements, types and other libraries. If you feel comfortable with the PHPUnit-API you'll love this.

## installation

copy the assert.js from lib to your project. Its an AMD compatible file. You might need to adjust the dependencies: you can remove joose or knockout from the dependencies.  
The only real dependency is that QUnit is loaded globally.

## usage

require assert.js as a module. I assume that you name the assertion library just t.

```javascript
define(['assert'], function (t) {
  // add one of the following examples here

});
```

### setup function

QUnits setup and teardown function are a little bit critical, when they are invoked asynchronous. This library lets you define your own setups which are invoked manually from your test. This gives you more flexibility and extends your tests with the new assertions.
A full test setup might look like this:

```javascript
define(['assert'], function (t) {
  // add one of the following examples here

  QUnit.module("my sample test")

  // a default setup
  var setup = function(test) {
    return t.setup(test);
  }

  test("my first example test", function () {
    var that = setup(this);

    // use complex assertions here as that.assertXXXXXX or this.assertXXXX
    var aString = "the string";
  });
```

### assertions

Note that all assertions follow the xUnit/PHPUnit order of parameters. So that most assertions are like: assertXXXX(expected, actual) and not the other way round as QUnit does require it.
Write the messages for your assertions like a sentence that begins with "failed asserting that" or "asserted that". Qunit-assert will prepend those depending on a failing or successful test.
The most assertions are from the behaviour like assertions from PHPUnit.

#### assertEquals(expected, actual, message)

```javascript
that.assertEquals("the string", aString, "aString equals expected string");
```

#### assertSame(expected, actual[, message])
#### assertNotSame(expected, actual[, message])

asserts that expected === actual

#### assertTrue(actual[, message])
#### assertFalse(actual[, message])
#### assertNotFalse(actual[, message])
#### assertNotUndefined(actual[, message])

#### fail(message)

use this to do an always failing assertion

#### assertContains(expectedSubString, actualString, message)

asserts that the `expectedSubString` is in `actualString`.

#### assertAttributeEquals(expected, actualAttribute, actualObject[, message])

asserts thats the `actualAttribute` from `actualObject` equals to the the `expected`.

#### assertAttributeNotUndefined(actualAttribute, actualObject, message)

asserts thats the `actualAttribute` from `actualObject` is not undefined.

#### assertLength(expectedLength, actualArray[, message])

asserts the length of an array.

#### assertType(expectedType, actual[, message])

asserts that `actual` is of the `expectedType`. `expectedType` can be one of: string, integer, float, array, object, number, boolean.

#### assertFunction(actual[, message])

#### assertEmptyObject(actual[, message])

#### assertjQuery(actualObject[, message])

asserts that the actualObject is a jQuery object.

#### assertjQueryLength(length, actualJQueryObject[, message])

asserts that the actualObject is jQuery object and has the length.

#### assertjQueryLengthGT()

asserts that the actualObject is jQuery object and has the length greater than the given.

#### assertjQueryHasClass(expectedClass, jQueryObject[, message])
#### assertjQueryHasNotClass(expectedClass, jQueryObject[, message])
#### assertjQueryIs(expectedSelector, jQueryObject[, message])

#### assertjQueryHasWidget(expectedName, jQueryObject[, message])

asserts that the jquery object has a jquery-ui widget with the `expectedName` attached. (`.data("expectedName")` from object is defined)

#### assertJooseInstanceOf(expectedConstructor, actualObject[, message])

asserts that the `actualObject` was constructed with the `expectedConstructor`. Be sure to provide a real constructor and not a string or something.

#### assertHasJooseWidget
#### assertJooseDoesRole
