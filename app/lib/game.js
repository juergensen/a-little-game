'use strict';

const SAT = require('sat')
const Entity = require('./entity.js');
const Player = require('./player.js')
const Debri = require('./debri.js')
const Camera = require('./camera.js')
const Npc = require('./npc.js')
const Response = SAT.Response
const Vector = SAT.Vector
const shortid = require('shortid');

module.exports = class Game {
  constructor(canvas) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 4000;
    this.canvas.height = 4000;
    this.canvasCam = canvas;
    this.ctxCam = this.canvasCam.getContext("2d");
    this.objects = {};
    this.playerIDs = []
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
    this.camera = new Camera(this)
    var id = shortid.generate();
    this.objects[id] = new Player(this, "Torge", id);
    this.playerIDs.push(id)
    this.camera.follow(this.objects[id])
    var id = shortid.generate();
    this.objects[id] = new Player(this, "supermomme", id);
    this.objects[id].keymap = {up:38,left:37,down:40,right:39,shoot:96};
    this.playerIDs.push(id)
    // var id = shortid.generate();
    // this.objects[id] = new Npc(this, id);
    this.drawGrid();
    this.gameLoop();
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
  genDebri(objId) {
    for (var i = 0; i < 3; i++) {
      var id = shortid.generate()
      this.objects[id] = new Debri(this, this.objects[objId], i, id);
    }
  }
  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    if(!this.pause) {
      this.ctx.clearRect(this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100, this.canvasCam.height+100);
      this.ctx.drawImage(this.parallaxCanvas,this.camera.pos.x/1.15,this.camera.pos.y/1.15,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100,this.canvasCam.height+100)
      this.ctx.drawImage(this.backgroundCanvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x,this.camera.pos.y,this.canvasCam.width,this.canvasCam.height)
      for (let obj in this.objects) {
        this.objects[obj].update();
      }
      for (let obj in this.objects) {
        this.objects[obj].draw();
      }
      this.ctxCam.clearRect(0, 0, this.canvasCam.width, this.canvasCam.height)
      this.ctxCam.drawImage(this.canvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,0,0,this.canvasCam.width,this.canvasCam.height)
      this.camera.update();
    }
  }
}
