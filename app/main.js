'use strict';

var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext("2d");
window.addEventListener('resize', resizeCanvas, false);
 function resizeCanvas () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas()
var game = require('./lib/multiplayer/game.js');
var Game;



  var socket = require('socket.io-client')('http://juergensen.me:9001');
  socket.on('connect', function(){
    console.log("connect");
    var config = {map:{width:4000,height:4000},fps:10}

    socket.on('joinRequestAnswer', function (data) {
      console.log("JOIN REQUEST ANSWER",data);

      Game = new game(canvas, ctx, data, socket)
    })

    socket.emit('joinRequest', {})

  });


  socket.on('disconnect', function(){
    console.log("disconnect");
    //Game = null;
    delete window.Game;
    console.log(Game);
    ctx.clearRect(0,0,canvas.width,canvas.height)
  });
