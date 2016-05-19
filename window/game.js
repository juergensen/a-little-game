'use strict';

const canvas = document.getElementById("myCanvas");
const ctx =  canvas.getContext("2d");
var playerImg = document.getElementById("playerImg");
var npcImg = document.getElementById("npcImg");
var shotImg = document.getElementById("shotImg");
/*
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx =  canvas.getContext("2d");
    this.players = [new Player(this.canvas, this.ctx, {name:"supermomme"})]

    var thisClass = this;
    document.addEventListener("keydown", function (evt) {
      if (evt.which === 27) {
        thisClass.togglePause()
      }
    });
  }
  //PAUSE
  pause() {
    this.paused = true;
    return true;
  }
  continue() {
    this.paused = false;
    return false;
  }
  togglePause() {
    if (this.paused) {
      this.paused = false;
      return false;
    } else {
      this.paused = true;
      return true;
    }
  }
  //PAUSE END


}



class Player {
  constructor(canvas, context, config) {
    this.name = config.name || "Player"
    this.speed = config.speed || 5
    this.shootSpeed = config.shootSpeed || 5
    this.pos = config.pos || {x:10,y:10}
    this.canvas = canvas
    this.context = context
    this.keysNum = config.keynum || {up:87,left:65,down:83,right:68,shoot:32}
    this.keysTrig = {up:false,left:false,down:false,right:false,shoot:false}
    this.kills = 0
    this.shootDelay = 0
    this.shoots = []

    var thisClass = this;
    document.addEventListener("keydown", function (evt) {
      console.log(evt)
    });
    document.addEventListener("keyup", function (evt) {
      console.log(evt)
    })
    /*
    document.addEventListener("keydown", function (evt) {
      for (var key in thisClass.keysNum) {
        if (evt.which === thisClass.keysNum[key]) {
          thisClass.keysTrig[key] = true
        }
      }
    });
    document.addEventListener("keyup", function (evt) {
      for (var key in thisClass.keysNum) {
        if (evt.which === thisClass.keysNum[key]) {
          thisClass.keysTrig[key] = false
        }
      }
    })
    *a/
  }

  /*
  move() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var key in this.keysTrig) {
      if (this.keysTrig[key]) {
        switch (key) {
          case "up":
            this.pos.y -= this.speed;
          break;
          case "down":
            this.pos.y += this.speed
          break;

          case "left":
            this.pos.x -= this.speed
          break;
          case "right":
            this.pos.x += this.speed
          break;
          case "shoot":
            this.shoot()
          break;
        }
      }
    }
    this.context.drawImage(playerImg, this.pos.x, this.pos.y);
  }
  shoot() {
    this.shoots.push(new Shoot);
    this.shootDelay = this.shootSpeed
  }
  gameLoop() {
    var thisClass = this;
    setInterval(function () {
      thisClass.move()
    },50)
  }*a/
}

var game = new Game(canvas)
*/

class Player {
  constructor(config, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.name = "Player"
    this.acceleration = 0.1
    this.angularAcceleration = 0.05
    this.speed = 0
    this.maxSpeed = 10
    this.x = 0
    this.key = {keys:{up:87,left:65,down:83,right:68,shoot:32},
                trig:{up:false,left:false,down:false,right:false,shoot:false}}
    this.pos = {x:10,y:10}
    this.shots = [];
    this.shotDelayConfig = 10
    this.shotDelay = 0;
    this.kills = 0;
    if (config.name) { this.name = config.name }
    if (config.key) { this.key.keys = config.key }
    if (config.pos) { this.pos = config.pos }


    var thisClass = this
    document.addEventListener("keydown", function (evt) {
      document.getElementById('keynum').innerHTML = evt.which
      for (var key in thisClass.key.keys) {
        if (evt.which === thisClass.key.keys[key]) {
          thisClass.key.trig[key] = true
        }
      }
    });
    document.addEventListener("keyup", function (evt) {
      for (var key in thisClass.key.keys) {
        if (evt.which === thisClass.key.keys[key]) {
          thisClass.key.trig[key] = false
        }
      }
    })
  }

  keyEvents() {
    for (var key in this.key.trig) {
      if (this.key.trig[key]) {
        switch (key) {
          case "up":
            this.goForward()
          break;
          case "down":
            this.goBackward()
          break;
          case "left":
            this.goLeft()
          break;
          case "right":
            this.goRight()
          break;
          case "shoot":
            this.newShoot()
          break;
        }
      }
    }
    return this.pos;
  }

  events() {
    this.keyEvents()
    this.move()
    this.shotEvents()
    console.log(this.x);
  }

  goForward() {
    this.speed += this.acceleration
    if (this.speed >= this.maxSpeed) { this.speed = this.maxSpeed; }
  }
  goBackward() {
    this.speed -= this.acceleration
    if (this.speed <= 0) { this.speed = 0; }
  }
  goLeft() { this.x -= this.angularAcceleration }
  goRight() { this.x += this.angularAcceleration }

  getRV () { this.rv = {x:Math.cos(this.x), y:Math.sin(this.x)} }
  move() {
    this.getRV()
    this.pos.x += this.rv.x * this.speed
    this.pos.y += this.rv.y * this.speed
    if (this.pos.x < 0) { this.pos.x = 0 }
    if (this.pos.y < 0) { this.pos.y = 0 }
    if (this.pos.x > this.canvas.width) { this.pos.x = this.canvas.width }
    if (this.pos.y > this.canvas.height) { this.pos.y = this.canvas.height }
  }
  newShoot() {
    if (this.shotDelay == 0) {
      this.shotDelay = this.shotDelayConfig;
      this.shots.push(new Shoot({
        pos:{x:this.pos.x,y:this.pos.y},
        rv:{x:this.rv.x,y:this.rv.y},
        x:this.x,
        speed:this.speed
      }, canvas))
    }
  }
  shotEvents() {
    if (this.shotDelay > 0) {this.shotDelay--;} else if (this.shotDelay < 0) {this.shotDelay = 0;}
    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].move()
      if (this.shots[i].delete) {
        this.shots.splice(i,1);
      }
    }
  }

}

class Shoot {
  constructor(config, canvas) {
    this.pos = {x:0,y:0}
    this.rv = {x:0,y:0}
    this.speed = 10
    this.x = 0
    this.delete = false
    this.canvas = canvas
    if (config.speed) { this.speed += config.speed }
    if (config.pos) { this.pos = config.pos }
    if (config.rv) { this.rv = config.rv }
    if (config.x) { this.x = config.x }
  }
  move() {
    this.pos.x += this.rv.x * this.speed
    this.pos.y += this.rv.y * this.speed
    if (this.pos.x < -32) { this.pos.x = -32; this.delete = true }
    if (this.pos.y < -32) { this.pos.y = -32; this.delete = true }
    if (this.pos.x > this.canvas.width+32) { this.pos.x = this.canvas.width+32; this.delete = true }
    if (this.pos.y > this.canvas.height+32) { this.pos.y = this.canvas.height+32; this.delete = true }
  }
}

class Npc {
  constructor(config, canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.pos = {x:canvas.width-20,y:40}

    this.angularAcceleration = 0.03
    this.speed = 1.5
    this.x = Math.PI

    if (config.pos) { this.pos = config.pos }
  }
  getRV () { this.rv = {x:Math.cos(this.x), y:Math.sin(this.x)} }
  move() {
    this.getRV()
    this.pos.x += this.rv.x * this.speed
    this.pos.y += this.rv.y * this.speed
    if (this.pos.x < 0) { this.pos.x = 0 }
    if (this.pos.y < 0) { this.pos.y = 0 }
    if (this.pos.x > this.canvas.width) { this.pos.x = this.canvas.width }
    if (this.pos.y > this.canvas.height) { this.pos.y = this.canvas.height }
  }
}

function collision(players, npcs, cb) {
  for (var i = 0; i < players.length; i++) {
    var shots = players[i].shots
    for (var f = 0; f < shots.length; f++) {
      for (var r = 0; r < npcs.length; r++) {
        if (shots[f].pos.x+8 >= npcs[r].pos.x &&
            shots[f].pos.x-8 <= npcs[r].pos.x &&
            shots[f].pos.y+8 >= npcs[r].pos.y &&
            shots[f].pos.y-8 <= npcs[r].pos.y) {
          cb(i, f, r)//Player, Shot, NPC
        }
      }
    }
  }
}


var tickCount = 0,
    ticksPerFrame = 3;

  var players = [
    new Player({name:"supermomme"}, canvas, ctx),
    new Player({name:"Player 20", key:{up:38,down:40,left:37,right:39,shoot:13}, pos:{x:20,y:20}}, canvas, ctx)
  ]
  var npcs = [
    new Npc({}, canvas, ctx)
  ]

function gameLoop () {
  window.requestAnimationFrame(gameLoop);
  tickCount += 1;

  //Do Stuff
  //Player
  players[0].ctx.clearRect(0-100, 0-100, canvas.width+100, canvas.height+100);
  for (var i = 0; i < players.length; i++) {
    players[i].events()

    players[i].ctx.translate(players[i].pos.x, players[i].pos.y);
    players[i].ctx.rotate(players[i].x);
    players[i].ctx.drawImage(playerImg, -8, -8);
    players[i].ctx.rotate(-players[i].x);
    players[i].ctx.translate(-players[i].pos.x, -players[i].pos.y);

    players[i].ctx.font = "10px Arial";
    players[i].ctx.fillText(players[i].name,players[i].pos.x-players[i].ctx.measureText(players[i].name).width/2, players[i].pos.y+15);
    for (var r = 0; r < players[i].shots.length; r++) {
      players[i].ctx.translate(players[i].shots[r].pos.x, players[i].shots[r].pos.y);
      players[i].ctx.rotate(players[i].shots[r].x);
      players[i].ctx.drawImage(shotImg, -8, -8);
      players[i].ctx.rotate(-players[i].shots[r].x);
      players[i].ctx.translate(-players[i].shots[r].pos.x, -players[i].shots[r].pos.y);
    }

  }
  //Player END
  //NPC
  for (var i = 0; i < npcs.length; i++) {
    npcs[i].move()

    npcs[i].ctx.translate(npcs[i].pos.x, npcs[i].pos.y);
    npcs[i].ctx.rotate(npcs[i].x);
    npcs[i].ctx.drawImage(npcImg, -8, -8);
    npcs[i].ctx.rotate(-npcs[i].x);
    npcs[i].ctx.translate(-npcs[i].pos.x, -npcs[i].pos.y);
  }
  //NPC End
  //collision
  collision(players, npcs, function (playerId, shotId, npcId) {
    npcs.splice(npcId,1);
    players[playerId].shots.splice(shotId,1)
    players[playerId].kills++;
  })
  //collision END
  //Do Stuff End
}

// Start the game loop as soon as the sprite sheet is loaded
window.addEventListener("load", gameLoop);
