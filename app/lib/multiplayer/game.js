'use strict';

const SAT = require('sat')
const Entity = require('./entity.js');
const Player = require('./player.js')
const Debri = require('./debri.js')
const Scrab = require('./scrap.js')
const Camera = require('./camera.js')
const Npc = require('./npc.js')
const Response = SAT.Response
const Vector = SAT.Vector
const Poly = SAT.Polygon
const shortid = require('shortid');
const gameloop = require('node-gameloop');

module.exports = class Game {
  constructor(canvas, ctx, config, socket) {
    this.config = config;
    this.socket = socket;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.config.map.width;
    this.canvas.height = this.config.map.height;
    this.canvasCam = canvas;
    this.ctxCam = ctx;
    this.drawObjects = {}
    this.pause = this.config.pause
    this.image = {
      player:new Image(),
      playerOverlay:new Image(),
      npc:new Image(),
      shot:new Image(),
      err:new Image(),
      scrap:new Image()
    }
    this.image.player.src = "./image/player_space_ship.png";
    this.image.playerOverlay.src = "./image/player_space_ship_overlay.png";
    this.image.npc.src = "./image/npc_space_ship.png";
    this.image.shot.src = "./image/shot.png";
    this.image.err.src = "./image/player_space_ship.png";
    this.image.scrap.src = './image/scrap.png'
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
    this.camera = new Camera(this)

    this.newPlayer()

    this.serverHandler(socket)
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

  }/*
  genDebri(objId) {
    for (var i = 0; i < 3; i++) {
      var id = shortid.generate()
      this.drawObjects[id] = new Debri(this, this.drawObjects[objId], i, id);
    }
    for (var i = 0; i < 5+Math.round(Math.random()*5); i++) {
      var id = shortid.generate()
      this.drawObjects[id] = new Scrab(this, this.drawObjects[objId], i, id);
    }
  }*/
  newPlayer() {
    this.player = {
      id:this.socket.id,
      pos:new Vector(Math.random()*this.config.map.width,Math.random()*this.config.map.height),
      dv:new Vector(0,0),
      av:new Vector(0,1),
      hitpoints:1,
      mass:1,
      exists:true,
      entity:"Player",
      name:"supermomme",
      collisionDelay:0,
      showOverlay:false,
      skin:{width:this.image.player.width,height:this.image.player.height},
    }
    this.player.hitbox = new Poly(this.player.pos, [
      new Vector(this.player.pos.x-this.image.player.width,this.player.pos.y-this.image.player.height),
      new Vector(this.player.pos.x+this.image.player.width,this.player.pos.y-this.image.player.height),
      new Vector(this.player.pos.x+this.image.player.width,this.player.pos.y+this.image.player.height),
      new Vector(this.player.pos.x-this.image.player.width,this.player.pos.y+this.image.player.height)
    ]);
  }
  serverHandler(socket) {
    socket.on('drawObjects', (data) => {
      this.drawObjects = data;
    })
    socket.on('pause', (data) => {
      this.pause = data;
    })
  }

  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    this.ctx.clearRect(this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100, this.canvasCam.height+100);
    this.ctx.drawImage(this.parallaxCanvas,this.camera.pos.x/1.15,this.camera.pos.y/1.15,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x-50,this.camera.pos.y-50,this.canvasCam.width+100,this.canvasCam.height+100)
    this.ctx.drawImage(this.backgroundCanvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,this.camera.pos.x,this.camera.pos.y,this.canvasCam.width,this.canvasCam.height)

    if (!this.pause.state) {
      Player(this)
      if (this.player.exists) {
        var skin = this.image.player
        this.ctx.lineWidth="1";
        this.ctx.strokeStyle="black";
        this.ctx.translate(this.player.pos.x, this.player.pos.y);
        this.ctx.rotate(Math.atan2(this.player.av.y,this.player.av.x));
        this.ctx.drawImage(skin, -skin.width/2, -skin.height/2);
        //if(this.player.showOverlay){ this.ctx.drawImage(this.image.playerOverlay, -this.image.playerOverlay.width/2, -this.image.playerOverlay.height/2);};
        this.ctx.rotate(-Math.atan2(this.player.av.y,this.player.av.x));

        //TEXT / LIVE
        let TextWidth = this.ctx.measureText(this.player.name).width;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.player.name,-TextWidth/2,-17)
        this.ctx.beginPath();
        this.ctx.lineWidth="4";
        this.ctx.strokeStyle="green";
        this.ctx.moveTo(-TextWidth/2,-14);
        this.ctx.lineTo((-TextWidth/2) + this.player.hitpoints*TextWidth,-14);
        this.ctx.stroke();

        //TEXT LIVE END
        this.ctx.translate(-this.player.pos.x, -this.player.pos.y);
      }
      for (let obj in this.drawObjects) {
        if(this.drawObjects[obj].exists && this.drawObjects[obj].id != this.player.id) {
          this.ctx.lineWidth="1";
          this.ctx.strokeStyle="black";
          this.ctx.translate(this.drawObjects[obj].pos.x, this.drawObjects[obj].pos.y);
          this.ctx.rotate(Math.atan2(this.drawObjects[obj].av.y,this.drawObjects[obj].av.x));


          switch (this.drawObjects[obj].entity) {
            case "Player":
              var skin = this.image.player
            break;
    /*        case "Npc":
              var skin = this.image.npc
            break;
            case "Shot":
              var skin = this.image.shot
            break;*/
            default:
              var skin = this.image.err;
          }

          this.ctx.drawImage(skin, -skin.width/2, -skin.height/2);
        //  if(this.drawObjects[obj].showOverlay){ this.ctx.drawImage(this.image.playerOverlay, -this.image.playerOverlay.width/2, -this.image.playerOverlay.height/2);};


          this.ctx.rotate(-Math.atan2(this.drawObjects[obj].av.y,this.drawObjects[obj].av.x));
          //TEXT LIVE
          if (this.drawObjects[obj].entity == "Player") {
            let TextWidth = this.ctx.measureText(this.drawObjects[obj].name).width;
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(this.drawObjects[obj].name,-TextWidth/2,-17)
            this.ctx.beginPath();
            this.ctx.lineWidth="4";
            this.ctx.strokeStyle="green";
            this.ctx.moveTo(-TextWidth/2,-14);
            this.ctx.lineTo((-TextWidth/2) + this.drawObjects[obj].hitpoints*TextWidth,-14);
            this.ctx.stroke();
          }

          //TEXT LIVE END
          this.ctx.translate(-this.drawObjects[obj].pos.x, -this.drawObjects[obj].pos.y);
        }
      }



    }
    this.ctxCam.clearRect(0, 0, this.canvasCam.width, this.canvasCam.height)
    this.ctxCam.drawImage(this.canvas,this.camera.pos.x,this.camera.pos.y,this.camera.viewPortRect.w,this.camera.viewPortRect.h,0,0,this.canvasCam.width,this.canvasCam.height)
    this.camera.update();

  }
}
