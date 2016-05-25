'use strict';

var canvas = document.getElementById('myCanvas')
window.addEventListener('resize', resizeCanvas, false);
 function resizeCanvas () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas()
var Game = require('./lib/game.js');
var game = new Game(canvas)
