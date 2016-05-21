'use strict';

//options
var defaultAcceleration = 0.1,
    defaultAngularAcceleration = 0.05,
    defaultMaxSpeed = 10,
    defaultShotDelayConfig = 10,
    defaultShotSpeed = 5,
    defaultNpcSpeed = 1.5,
    npcSpawnRate = 25,
    npcLimit = 10,
    drag = 0.99,
    doDrag = true;
//END options

const canvas = document.getElementById("myCanvas");
const ctx =  canvas.getContext("2d");
var howler = require('howler');

var playerImg = new Image(); playerImg.src = "./image/player_space_ship.png"
var npcImg = new Image(); npcImg.src = "./image/npc_space_ship.png"
var shotImg = new Image(); shotImg.src = "./image/shot.png"
var shotSound = new Howl({urls: ['./sound/shot_sound.mp3']})
var npcExplosionSound = new Howl({urls: ['./sound/explosion.mp3']});


function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);


class Player {
  constructor(config, canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.name = "Player"
    this.acceleration = defaultAcceleration
    this.angularAcceleration = defaultAngularAcceleration
    this.speed = 0
    this.maxSpeed = defaultMaxSpeed
    this.x = 0
    this.key = {keys:{up:87,left:65,down:83,right:68,shoot:32},
                trig:{up:false,left:false,down:false,right:false,shoot:false}}
    this.pos = {x:10,y:10}
    this.shots = [];
    this.shotDelayConfig = defaultShotDelayConfig;
    this.shotDelay = 0;
    this.kills = 0;
    this.hitPlayer = 0;
    if (config.name) { this.name = config.name }
    if (config.key) { this.key.keys = config.key }
    if (config.pos) { this.pos = config.pos }


    var thisClass = this
    document.addEventListener("keydown", function (evt) {
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

  getRV () { this.rv = {x:Math.cos(this.x), y:Math.sin(this.x)};  }
  move() {
    this.getRV()
    this.pos.x += this.rv.x * this.speed
    this.pos.y += this.rv.y * this.speed
    if (this.pos.x < 0) { this.pos.x = 0 }
    if (this.pos.y < 0) { this.pos.y = 0 }
    if (this.pos.x > this.canvas.width) { this.pos.x = this.canvas.width }
    if (this.pos.y > this.canvas.height) { this.pos.y = this.canvas.height }
    if (doDrag && !this.key.trig.up){this.speed *= drag; if(this.speed < 0.05){this.speed = 0}}
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
      shotSound.play();
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
    this.speed = defaultShotSpeed
    this.x = 0
    this.delete = false
    this.canvas = canvas
    if (config.speed) { this.speed += config.speed }
    if (config.pos) { this.pos = config.pos }
    if (config.rv) { this.rv = config.rv }
    if (config.x) { this.x = config.x }
  }
  getRV () { this.rv = {x:Math.cos(this.x), y:Math.sin(this.x)} }
  move() {
    this.getRV()
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
    this.speed = defaultNpcSpeed
    this.x = Math.PI
    this.delete = false
    if (config.pos) { this.pos = config.pos }
  }
  getRV () { this.rv = {x:Math.cos(this.x), y:Math.sin(this.x)} }
  move() {
    this.getRV()
    this.pos.x += this.rv.x * this.speed
    this.pos.y += this.rv.y * this.speed
    if (this.pos.x < 0) { this.pos.x = -32; this.delete = true  }
    if (this.pos.y < 0) { this.pos.y = -32; this.delete = true }
    if (this.pos.x > this.canvas.width) { this.pos.x = this.canvas.width }
    if (this.pos.y > this.canvas.height) { this.pos.y = this.canvas.height }
  }
}

function collision(players, npcs, cb) {
  for (var i = 0; i < players.length; i++) {
    var shots = players[i].shots
    for (var f = 0; f < shots.length; f++) {
      for (var r = 0; r < npcs.length; r++) {
        if (shots[f] !== undefined) {
          if (shots[f].pos.x+16 >= npcs[r].pos.x &&
              shots[f].pos.x-16 <= npcs[r].pos.x &&
              shots[f].pos.y+16 >= npcs[r].pos.y &&
              shots[f].pos.y-16 <= npcs[r].pos.y) {
            cb(i, f, r)//Player, Shot, NPC
          }
        }
      }
    }
  }
  for (var i = 0; i < players.length; i++) {
    var shots = players[i].shots
    for (var r = 0; r < shots.length; r++) {
      shots[r]
      for (var f = 0; f < players.length; f++) {
        players[f]
        if (shots[f] !== undefined){
        if (shots[r].pos.x+8 >= players[f].pos.x &&
            shots[r].pos.x-8 <= players[f].pos.x &&
            shots[r].pos.y+8 >= players[f].pos.y &&
            shots[r].pos.y-8 <= players[f].pos.y) {
          if (f != i) {
            console.log(players[f].name+ " got hit by "+players[i].name);
            players[i].shots.splice(r,1);
            players[i].hitPlayer++;
          }
        }}
      }
    }
  }
}


var tickCount = 0,
    ticksPerFrame = 3;

  var players = [
    new Player({name:"Barne", pos:{x:20, y:Math.random()*canvas.height}}, canvas, ctx),
    new Player({name:"supermomme", key:{up:38,down:40,left:37,right:39,shoot:13}, pos:{x:20,y:Math.random()*canvas.height}}, canvas, ctx)
  ]
  var npcs = [
    new Npc({}, canvas, ctx)
  ]
  var npcGoal = 0;

function gameLoop () {
  window.requestAnimationFrame(gameLoop);
  tickCount += 1;

  //Do Stuff
  //collision
  collision(players, npcs, function (playerId, shotId, npcId) {
    npcs.splice(npcId,1);
    players[playerId].shots.splice(shotId,1)
    players[playerId].kills++;
    npcExplosionSound.play();
  })
  //collision END
  //SPAWN NPC
  if (Math.round(Math.random()*npcSpawnRate) == 0) {
    if (npcs.length < npcLimit) {
      npcs.push(new Npc({pos:{x:canvas.width+16, y:Math.random()*canvas.height}}, canvas, ctx))
    }
  }
  //SPAWN NPC END


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
    if (npcs[i].delete) {
      npcs.splice(i,1);
      npcGoal++;
    }
    npcs[i].ctx.translate(npcs[i].pos.x, npcs[i].pos.y);
    npcs[i].ctx.rotate(npcs[i].x);
    npcs[i].ctx.drawImage(npcImg, -8, -8);
    npcs[i].ctx.rotate(-npcs[i].x);
    npcs[i].ctx.translate(-npcs[i].pos.x, -npcs[i].pos.y);
  }
  //NPC End
  //Scoreboard
  var title = "Kills";
  ctx.font = "20px Arial";
  ctx.fillText(title,canvas.width-ctx.measureText(title).width,20);
  for (var i = 0; i < players.length; i++) {
    ctx.fillText(players[i].name+": "+players[i].kills,canvas.width-ctx.measureText(players[i].name+": "+players[i].kills).width,20*(i+2));
  }
  //Scoreboard END
  //Player Hit Scoreboard
  var title = "Hit Player";
  ctx.font = "20px Arial";
  ctx.fillText(title,0,20);
  for (var i = 0; i < players.length; i++) {
    ctx.fillText(players[i].name+": "+players[i].hitPlayer,0,20*(i+2));
  }
  //Player Hit Scoreboard
  //NPC Goal
  ctx.font = "20px Arial";
  ctx.fillText("Npc Goal: "+npcGoal,canvas.width-ctx.measureText("Npc Goal: "+npcGoal).width,canvas.height);
  //NPC Goal End
  //Do Stuff End
}

// Start the game loop as soon as the sprite sheet is loaded
window.addEventListener("load", gameLoop);
