'use strict';

const SAT = require('sat')
const Entity = require('./entity.js');
const Player = require('./player.js')
const Debri = require('./debri.js')
const Camera = require('./camera.js')
const Npc = require('./npc.js')
const Response = SAT.Response
const Vector = SAT.Vector

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
      err:new Image(),
      playerDebri0: new Image(),
      playerDebri1: new Image(),
      playerDebri2: new Image()
    }
    this.image.player.src = "./image/player_space_ship.png";
    this.image.playerOverlay.src = "./image/player_space_ship_overlay.png";
    this.image.npc.src = "./image/npc_space_ship.png";
    this.image.shot.src = "./image/shot.png";
    this.image.err.src = "./image/player_space_ship.png";
    this.image.playerDebri0.src = './image/player_debri_0.png'
    this.image.playerDebri1.src = './image/player_debri_1.png'
    this.image.playerDebri2.src = './image/player_debri_2.png'
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
      shotAcceleration: 2
    }
    this.pause = false
    this.objects.push(new Player(this, "Torge"));
    this.objects.push(new Npc(this))
    this.camera = new Camera(this)
    this.camera.follow(this.objects[1])
    // this.objects.push(new Player(this, "supermomme"));
    // this.objects[1].keymap = {up:38,left:37,down:40,right:39,shoot:96};
    this.response = new Response()
    this.drawGrid();
    this.gameLoop();
  }
checkCollision() {
    for (let obj in this.objects) {
        for (let obj2 in this.objects) {
          this.response.clear()
            if (this.objects[obj] != this.objects[obj2] && SAT.testPolygonPolygon(this.objects[obj].hitbox, this.objects[obj2].hitbox, this.response)&& this.objects[obj].exists && this.objects[obj2].exists) {
                if (this.objects[obj].constructor.name == 'Shot' && this.objects[obj2].constructor.name == 'Shot') {
                    this.objects[obj].hitpoints = 0;
                    this.objects[obj2].hitpoints = 0;
                }
                if (this.objects[obj].constructor.name == 'Npc' && this.objects[obj2].constructor.name == 'Npc') {

                }
                if ((this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Shot' && this.objects[obj2].playerProtection <= 0) ||
                    (this.objects[obj].constructor.name == 'Npc' && this.objects[obj2].constructor.name == 'Shot') ||
                    (this.objects[obj].constructor.name == 'Debri' && this.objects[obj2].constructor.name == 'Shot')) {
                    this.objects[obj2].hitpoints = 0;
                    this.objects[obj].hitpoints -= 0.01 * this.objects[obj2].dv.sub(this.objects[obj].dv).len();
                    this.objects[obj].dv.add(this.objects[obj2].dv.scale(0.1, 0.1));
                }
                if (this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Npc') {

                }
                if ((this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Player') ||
                    (this.objects[obj].constructor.name == 'Debri' && this.objects[obj2].constructor.name == 'Debri')) {
                    this.response.clear()
                    this.objects[obj].dv.sub(this.response.overlapV.clone().scale(0.5, 0.5));
                    this.objects[obj2].dv.add(this.response.overlapV.clone().scale(0.5, 0.5))
                }
                if ((this.objects[obj].constructor.name == 'Player' && this.objects[obj2].constructor.name == 'Debri')) {
                    this.objects[obj].dv.sub(this.response.overlapV.clone().scale(0.1, 0.1));
                    this.objects[obj2].dv.add(this.response.overlapV.clone().scale(0.9, 0.9))
                }
                return; // Damit der nicht weiter rechnet
            }
        }
    }
}
  deleteEntity() {
    for (let obj in this.objects) {
      if (this.objects[obj].hitpoints <= 0) {
        if(this.objects[obj].constructor.name == 'Player' || this.objects[obj].constructor.name == 'Npc') {
          new Audio("./sound/explosion.wav").play()
          this.objects.push(new Debri(this, this.objects[obj], 0));
          this.objects.push(new Debri(this, this.objects[obj], 1));
          this.objects.push(new Debri(this, this.objects[obj], 2));
          if(this.objects[obj].constructor.name == 'Player'){this.objects[obj].exists = false;return;}
        }
        this.objects.splice(obj, 1)
      }
    }
  }
  drawGrid() {
    this.backgroundCanvas = document.createElement('canvas');
    this.backgroundCanvas.width = this.canvas.width
    this.backgroundCanvas.height = this.canvas.height
    this.backgroundCtx = this.backgroundCanvas.getContext("2d");

    this.parallaxCanvas = document.createElement('canvas');
    this.parallaxCanvas.width = this.canvas.width
    this.parallaxCanvas.height = this.canvas.height
    this.parallaxCtx = this.parallaxCanvas.getContext("2d");
    this.parallaxCtx.fillRect(0,0,this.parallaxCanvas.width,this.parallaxCanvas.height)

    this.stars = 1000
    this.starSpawnrate = 0.5
    for (var i = 0; i < this.stars; i++) {
      var star = {
        pos:new Vector(Math.random()*this.backgroundCanvas.width,Math.random()*this.backgroundCanvas.height),
        radius:10
      }
      var grd = this.backgroundCtx.createRadialGradient(star.pos.x, star.pos.y, 1, star.pos.x, star.pos.y, star.radius);
      grd.addColorStop(0, "white");
      grd.addColorStop(1, "transparent");
      this.backgroundCtx.fillStyle = grd;
      this.backgroundCtx.fillRect(star.pos.x-star.radius, star.pos.y-star.radius, star.radius*2, star.radius*2);
    }
    for (var i = 0; i < this.stars; i++) {
      var star = {
        pos:new Vector(Math.random()*this.parallaxCanvas.width,Math.random()*this.parallaxCanvas.height),
        radius:5
      }
      var grd = this.parallaxCtx.createRadialGradient(star.pos.x, star.pos.y, 1, star.pos.x, star.pos.y, star.radius);
      grd.addColorStop(0, "white");
      grd.addColorStop(1, "transparent");
      this.parallaxCtx.fillStyle = grd;
      this.parallaxCtx.fillRect(star.pos.x-star.radius, star.pos.y-star.radius, star.radius*2, star.radius*2);
    }

  }
  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    if(!this.pause) {
      this.ctx.clearRect(this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100, this.canvasCam.height+100);
      this.ctx.drawImage(this.parallaxCanvas,this.camera.pos.x/1.15,this.camera.pos.y/1.15,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100,this.canvasCam.height+100)
      this.ctx.drawImage(this.backgroundCanvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x,this.camera.pos.y,this.canvasCam.width,this.canvasCam.height)
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].update();
        this.objects[i].respawn();
      }
      this.camera.update();
      this.checkCollision();
      this.deleteEntity();
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw();
      }
      this.ctxCam.clearRect(0, 0, this.canvasCam.width, this.canvasCam.height)
      this.ctxCam.drawImage(this.canvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,0,0,this.canvasCam.width,this.canvasCam.height)
      for (var i = 0; i < this.objects.length; i++) {
        this.camera.drawCompass(i);
      }
    }
  }
}
