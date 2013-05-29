/*globals requirejs*/
requirejs.config({
  baseUrl: "/lib",
  
  paths: {
    fixtures: "../tests/files",
    tests: "../tests",
    qunit: "../vendor/qunit/qunit-1.10.0",
    "qunit-assert": "assert",
    jquery: "../vendor/jquery/jquery-1.10.0.min",

    // third party deps mocked
    joose: "mocks/joose",
    knockout: "mocks/knockout"
  }
});