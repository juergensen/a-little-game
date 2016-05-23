'use strict';

const SAT = require('sat')
const Entity = require('./entity.js');
const Player = require('./player.js')
const Camera = require('./camera.js')

module.exports = class Game {
  constructor(canvas) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 4000;
    this.canvas.height = 4000;
    this.canvasCam = canvas;
    this.ctxCam = this.canvasCam.getContext("2d");
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
      shotSpeed: 30,
      maxShotSpeed: 30,
      npcSpeed: 1.5,
      npcSpawnRate: 25,
      npcLimit: 10,
      drag: 0.99,
      doDrag: true,
      shotAcceleration: 2,
      showHitbox: false
    }
    this.pause = false
    this.objects.push(new Player(this, "Torge"));
    this.camera = new Camera(this)
    this.camera.follow(this.objects[0])
    // this.objects.push(new Player(this, "supermomme"));
    // this.objects[1].keymap = {up:38,left:37,down:40,right:39,shoot:96};
    this.drawGrid();
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
            this.objects[obj].hitpoints -= 0.1*this.objects[obj2].dv.len()/this.objects[obj2].maxShotSpeed;
          }
          if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Npc') {

          }
          if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Player') {

          }
          console.log(this.objects[obj],this.objects[obj2])
          return; // Damit der nicht weiter rechnet
        }
      }
    }
  }
  deleteEntity() {
    for (let obj in this.objects) {
      if (this.objects[obj].hitpoints <= 0) {
        this.objects.splice(obj, 1)
      }
    }
  }
  drawGrid() {
    for (var x = 0; x <= this.canvas.width; x += 60) {
      this.ctx.moveTo(0.5 + x, 0);
      this.ctx.lineTo(0.5 + x, this.canvas.height);
    }
    for (var x = 0; x <= this.canvas.height; x += 60) {
      this.ctx.moveTo(0, 0.5 + x);
      this.ctx.lineTo(this.canvas.width, 0.5 + x);
    }
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();
    this.image.grid = new Image();
    this.image.grid.src = this.ctx.canvas.toDataURL("image/png");
  }
  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    if(!this.pause) {
      this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.image.grid,0,0)
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].update();
      }
      this.camera.update();
      this.checkCollision();
      this.deleteEntity();
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw();
      }
      this.ctxCam.clearRect(0, 0, this.canvasCam.width, this.canvasCam.height)
      this.ctxCam.drawImage(this.canvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,0,0,this.canvasCam.width,this.canvasCam.height)
    }
  }
}
