// Sketch One
var s = function( p ) { // p could be any variable name
  p.setup = function() {
    setup2();
  };

  p.draw = function() {
    draw2();

  };
};
var myp5 = new p5(s, 'c1');

// Sketch Two
var t = function( p ) { 

  p.setup = function() {
    setup1();
  };

  p.draw = function() {
    draw1();

  };
};
var myp5 = new p5(t, 'c2');