define(['jquery', 'qunit', 'joose', 'knockout'], function ($, qunitIsGlobal, Joose, ko) {

  var baseAssertions = function (QUnit) {

    // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    var escapeRegexp = function(s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var isEmpty = function (object) {
      for (var i in object) {
        if (object.hasOwnProperty(i)) {
          return false;
        }
      }

      return true;
    };

    return {
      formatMessage: function(message, result) {
        if (message) {
          if (result) {
            return "asserted that "+String(message);
          } else {
            return "failed asserting that "+String(message);
          }
        }
        return null;
      },
      
      debug: function(item) {
        return QUnit.jsDump.parse(item);
      },
      
      /**
       * Sicherstellen, dass "Exception" vor dieser Funktion geladen wurde (asyncTest?)
       */
      assertException: function(expectedException, block, expectedMessage, debugMessage, assertions) {
        var that = this;

        var assert = function assertException(e) {
          var isException = e instanceof Psc.Exception;
          
          //assertTrue(isException, this.formatMessage("e ist eine (sub-)instanz von Exception", isException));
          QUnit.push( isException, isException, true, that.formatMessage(that.debug(e)+" is instanceof Psc.Exception", isException) );
        
          if (isException) {
            that.assertEquals(expectedException, e.getName(), "Name ist '"+expectedException+"'");
        
            if (expectedMessage) {
              QUnit.equal(e.getMessage(), expectedMessage, "Message ist '"+expectedMessage+"'");
            }
          
            if (assertions) {
              assertions(e);
            }
            
            return true;
          }
          
          return false;
        };
        
        return QUnit.raises(block, assert, debugMessage);
        //ok(false, "Es wurde eine Exception "+expectedException+" erwartet. Aber keine gecatched");
      },
      
      assertEquals: function(expected, actual, message) {
        var result = QUnit.equiv(actual, expected);
        QUnit.push( result, actual, expected, this.formatMessage(message || "two values are equal", result));
      },

      assertNotEquals: function(expected, actual, message) {
        var result = !QUnit.equiv(actual, expected);
        QUnit.push( result, actual, expected, this.formatMessage(message || "two values are not equal", result));
      },
    
      assertSame: function(expected, actual, message) {
        var result = (actual === expected);
        QUnit.push( result, actual, expected, this.formatMessage(message || "objects reference the same instance", result));
      },
      
      assertContains: function(expected, actual, message) {
        var result = actual.search(new RegExp(escapeRegexp(expected))) !== -1;
        QUnit.push( result, actual, expected, this.formatMessage(message) || "string/object contains "+this.debug(expected), result);
      },

      assertContainsNot: function(expected, actual, message) {
        var result = actual.search(new RegExp(escapeRegexp(expected))) === -1;
        QUnit.push( result, actual, expected, this.formatMessage(message) || "string/object does not contain "+this.debug(expected), result);
      },
      
      assertNotSame: function(expected, actual, message) {
        var result = actual !== expected;
        QUnit.push( result, actual, expected, this.formatMessage(message || "objects reference not the same instance", result));
      },
      
      assertTrue: function(actual, message) {
        var result = actual === true;
        QUnit.push( result, actual, true, this.formatMessage(message || this.debug(actual)+" is true ", result) );
      },
    
      assertFalse: function(actual, message) {
        var result = actual === false;
        QUnit.push( result, actual, false, this.formatMessage(message || this.debug(actual)+" is false ", result) );
      },
    
      assertNotFalse: function(actual, message) {
        var result = actual !== false;
        QUnit.push( result, actual, 'something not false', this.formatMessage(message || this.debug(actual)+" is not false ", result) );
      },
    
      assertNotUndefined: function(actual, message) {
        var result = actual !== undefined;
        QUnit.push( result, actual, 'something not undefined', this.formatMessage(message || this.debug(actual)+" is not undefined ", result) );
      },

      assertUndefined: function(actual, message) {
        var result = actual === undefined;
        QUnit.push( result, actual, 'something undefined', this.formatMessage(message || this.debug(actual)+" is undefined ", result) );
      },
      
      assertFunction: function(actual, message) {
        var result = $.isFunction(actual);
        QUnit.push( result, actual, '(a javascript function)', this.formatMessage(message || this.debug(actual)+" is a function", result) );
      },
      assertAttributeEquals: function(expected, actualAttribute, actualObject, message) {
        var actual;
        var result = actualObject[actualAttribute] && QUnit.equiv(expected, actual = actualObject[actualAttribute]);
        QUnit.push( result, actual, expected, this.formatMessage(message || this.debug(actualObject)+"["+actualAttribute+"] equals value ", result) );
      },
    
      assertAttributeNotUndefined: function(actualAttribute, actualObject, message) {
        var actual = actualObject[actualAttribute];
        var result = actual !== undefined;
        QUnit.push( result, actual, "something not undefined", this.formatMessage(message || this.debug(actualObject)+"["+actualAttribute+"] equals value ", result) );
      },
      
      
      assertLength: function (expectedLength, actualCountable, message) {
        var actual = actualCountable.length;
        var result = actual === expectedLength;
        QUnit.push( result, actual, expectedLength, this.formatMessage(message || "actualCountable .length equals expected length ", result) );
        return actualCountable;
      },

      /**
       *
       * @TODO chainable would be nice!
       * assertjQuery(object).length(3).hasClass('blubb);
       */
      assertjQuery: function(actualObject, message) {
        this.assertAttributeNotUndefined('jquery', actualObject, message || 'actual is a jquery object [in assertjQuery]');
      },
      
      assertjQueryLength: function(expectedLength, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryLength]');
        
        var actualLength = jQueryObject.length;
        var result = actualLength === expectedLength;
        QUnit.push( result, actualLength, expectedLength, this.formatMessage(message || "$('"+jQueryObject.selector+"').length equals expected length ", result) );
        return jQueryObject;
      },

      assertjQueryLengthGT: function(expectedLength, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryLength]');
        
        var actualLength = jQueryObject.length;
        var result = actualLength > expectedLength;
        QUnit.push( result, actualLength, expectedLength, this.formatMessage(message || "$('"+jQueryObject.selector+"').length > expected length ", result) );
        return jQueryObject;
      },
      
      assertjQueryHasClass: function(expectedClass, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryHasClass]');
        
        var actualClasses = jQueryObject.attr('class');
        var result = jQueryObject.hasClass(expectedClass);
        QUnit.push( result, actualClasses, expectedClass, this.formatMessage(message || "$('"+jQueryObject.selector+"').hasClass('"+expectedClass+"') ", result) );
        return jQueryObject;
      },

      assertjQueryHasNotClass: function(expectedClass, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryHasClass]');
        
        var actualClasses = jQueryObject.attr('class');
        var result = !jQueryObject.hasClass(expectedClass);
        QUnit.push( result, actualClasses, "NOT: "+expectedClass, this.formatMessage(message || "$('"+jQueryObject.selector+"').hasNOTClass('"+expectedClass+"') ", result) );
        return jQueryObject;
      },

      assertjQueryIs: function(expectedExpression, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryIs]');
        
        var actual = jQueryObject.is(expectedExpression);
        var result = actual === true;
        QUnit.push( result, actual, true, this.formatMessage(message || "$('"+jQueryObject.selector+"').is("+expectedExpression+") ", result) );
        return jQueryObject;
      },
      
      assertjQueryHasWidget: function(expectedName, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertJQueryHasWidget]');
        
        var actual = jQueryObject.data(expectedName);
        var result = actual !== undefined;
        QUnit.push( result, actual, true, this.formatMessage(message || "$('"+jQueryObject.selector+"') has jquery widget "+expectedName+" ", result) );
        
        //return jQueryObject;
      },

      fail: function(message) {
        QUnit.pushFailure( "failed: "+message );
      },

      ok: function(message) {
        QUnit.ok(true, message);
      },

      assertType: function(expectedType, actual, message) {
        var result;
        if (expectedType === "integer") {
          result = "number" === typeof actual && parseInt(actual, 10) === actual;
        } else if (expectedType === "float") {
          result = "number" === typeof actual && parseInt(actual, 10) !== actual;
        } else if (expectedType === 'array') {
          result = Object.prototype.toString.apply(actual) === '[object Array]';
        } else {
          result = expectedType === typeof actual;
        }

        return QUnit.push( result, typeof actual, expectedType, this.formatMessage(message || this.debug(actual)+" is typeof "+expectedType+".", result) );
      },

      assertEmptyObject: function(actual, message) {
        var result = isEmpty(actual);
        return QUnit.push( result, true, true, this.formatMessage(message || this.debug(actual)+" is an empty object.", result) );
      },
      
      // expected muss der Constructor sein, kein String!
      assertJooseInstanceOf: function(expected, actual, message) {
        if (!Joose.O.isClass(expected)) {
          this.fail(this.debug(expected)+" is NOT a valid Class. Is this a Constructor-Function?");
          return;
        }
        if (!Joose.O.isInstance(actual)) {
          this.fail(this.debug(actual)+" is not an object-instance");
          return;
        }
        
        var result = actual instanceof expected;
        // hier ist das diff überflüssig
        
        QUnit.push(result, "Instance of Class "+String(actual.meta.name), "Instance of Class "+String(expected), this.formatMessage(message || String(actual)+" is instanceof '"+String(expected)+"'", result));
      },

      assertInstanceOf: function(expected, actual, message) {
        if (!$.isFunction(expected)) {
          throw new Error("assertInstanceOf(): Constructor has to be a function.");
        }

        if ("object" !== typeof actual) {
          throw new Error("assertInstanceOf(): actual has to be an object");
        }
        
        var result = actual instanceof expected;

        QUnit.push(result, "object with other constructor", "instance of class "+String(expected), this.formatMessage(message || String(actual)+" is instanceof '"+String(expected)+"'", result));
      },
        
      // @var Constructor expectedJooseClass
      assertHasJooseWidget: function(expectedJooseClass, jQueryObject, message) {
        this.assertjQuery(jQueryObject, 'actual is a jquery object [in assertHasJooseWidget]');

        var actual = jQueryObject.data(), result = false, exceptionMessage = '', widget;

        widget = jQueryObject.data('joose');
        this.assertInstanceOf(expectedJooseClass, widget, message || "$('"+jQueryObject.selector+"') has joose widget linked: "+expectedJooseClass+" ");
        
        return widget;
      },
    
      // expected muss der Constructor sein, kein String!
      assertJooseDoesRole: function(expectedRole, actual, message) {
        if (!Joose.O.isClass(expectedRole)) {
          this.fail(this.debug(expectedRole)+" is NOT a valid Class. Is this a Constructor-Function for a Role?");
        }
        if (!Joose.O.isInstance(actual)) {
          this.fail(this.debug(actual)+" is not an object-instance");
        }
        
        var result = (Joose.O.isInstance(actual) && actual.meta.does(expectedRole)) ? true : false;
        
        var roles = actual.meta.getRoles();
    
        return QUnit.push(result, "Instance of Class "+String(actual.meta.name)+" Roles: "+roles, "Role "+String(expectedRole), this.formatMessage(message || String(actual)+" does '"+String(expectedRole)+"'", result));
      },
    
      // deprecated alias
      assertDoesRole: function(expectedRole, actual, message) {
        return this.assertJooseDoesRole(expectedRole, actual, message);
      }
    };
  };


  var assert = {
    boundQUnit: QUnit,

    setup: function(test, testSetups) {
      
      $.extend(test, {$widget: $('#visible-fixture')}, baseAssertions(this.boundQUnit), testSetups || {});
      
      return test;
    },

    visibleFixture: function (html) {
      if (html) {
        var $html = $(html);
        $('#visible-fixture').empty().append($html);
        
        return $html;
      }
      
      return $('#visible-fixture');
    },
    
    setupBinding: function(test, bindingName, $element) {
      var observable = ko.observable();
      var valueAccessor = function () { return observable; };
      var binding = ko.bindingHandlers[bindingName];

      test.koInit = function (value) {
        if (arguments.length === 1) {
          observable(value);
        }

        binding.init($element[0], valueAccessor);
      };

      test.koUpdate = function (value) {
        observable(value);

        binding.update($element[0], valueAccessor);
      };

      test.getObservable = function() {
        return observable;
      };

      return test;
    }
  };

  var contentEquals = function(el, text) {
    return $(el).text() === text;
  };

  $.expr[':'].contentEquals = $.expr.createPseudo  ?
    $.expr.createPseudo(function( text ) {
        return function( elem ) {
            return contentEquals( elem, text );
        };
    }) 
    : function( elem, i, match ) {
        return contentEquals( elem, match[3] );
    };

  return assert;
});