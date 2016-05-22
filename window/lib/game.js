'use strict';

const SAT = require('sat')

const Entity = require('./entity.js');
const Player = require('./player.js')
module.exports = class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.objects = [];
    this.image = {
      player:new Image(),
      playerOverlay:new Image(),
      npc:new Image(),
      shot:new Image(),
      err:new Image()
    }
    this.image.player.src = "./image/player_space_ship.png";
    this.image.playerOverlay.src = "./image/player_space_ship_overlay.png";
    this.image.npc.src = "./image/npc_space_ship.png";
    this.image.shot.src = "./image/shot.png";
    this.image.err.src = "./image/player_space_ship.png";
    this.defaults = {
      acceleration: 0.2,
      angularAcceleration: 0.05,
      maxSpeed: 10,
      shotDelayConfig: 10,
      shotSpeed: 15,
      maxShotSpeed: 15,
      npcSpeed: 1.5,
      npcSpawnRate: 25,
      npcLimit: 10,
      drag: 0.99,
      doDrag: true,
      shotAcceleration: 1
    }
    this.pause = false
    this.objects.push(new Player(this, "Torge"));
    this.objects.push(new Player(this, "supermomme"));
    this.objects[1].keymap = {up:38,left:37,down:40,right:39,shoot:96};

    this.gameLoop();
  }

  checkCollision() {
    for(let obj in this.objects) {
      for(let obj2 in this.objects) {
        if(this.objects[obj] != this.objects[obj2] && SAT.testPolygonPolygon(this.objects[obj].hitbox, this.objects[obj2].hitbox)) {
          if (this.objects[obj].constructor.name == 'Shot' && this.objects[obj2].constructor.name == 'Shot') {
              this.objects[obj].hitpoints = 0;
              this.objects[obj2].hitpoints = 0;
          }
          if (this.objects[obj].constructor.name == 'Npc' && this.objects[obj2].constructor.name == 'Shot') {
            this.objects[obj2].hitpoints = 0;
            this.objects[obj].hitpoints -= 0.25;
          }
          if (this.objects[obj].constructor.name == 'Npc' && this.objects[obj2].constructor.name == 'Npc') {

          }
          if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Shot') {
            this.objects[obj2].hitpoints = 0;
            this.objects[obj].hitpoints -= 0.1;
          }
          if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Npc') {

          }
          if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Player') {

          }
          return; // Damit der nicht weiter rechnet
        }
      }
      if (this.objects[obj].hitpoints <= 0) {
         this.objects.splice(obj,1)
        //console.log("BUM");
      }
    }
  }

  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    if(!this.pause) {
      this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
      this.checkCollision();
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].update();
      }
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw();
      }
    }
  }
}
