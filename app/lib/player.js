'use strict';

const Entity = require('./entity.js')
const Shot = require('./shot.js')
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;
const shortid = require('shortid');

module.exports = class Player extends Entity {
  constructor(game, name, id) {
    super(game);
    this.id = id;
    this.name = name || 'Player';
    
    this.angularAcceleration = this.game.defaults.angularAcceleration;

    this.maxSpeed = this.game.defaults.maxSpeed;

    this.keymap = {up:87,left:65,down:83,right:68,shoot:32};
    this.key = {up:false,left:false,down:false,right:false,shoot:false};

    this.shots = [];
    this.shotDelayConfig = this.game.defaults.shotDelayConfig;

    this.shotDelay = 0;
    this.kills = 0;
    this.hitPlayer = 0;
    this.scrapCargo = 0;
    this.av.y = this.acceleration = this.game.defaults.acceleration;;
    this.lr = 1
    this.spawnTime = 180
    this.skin = this.game.image.player
    this.skinOverlay = this.game.image.playerOverlay
    document.addEventListener("keydown", (evt) => {
      for (let key in this.keymap) {
        if (evt.which === this.keymap[key]) {
          this.key[key] = true;
        }
      }
    });
    document.addEventListener("keyup", (evt) => {
      for (let key in this.keymap) {
        if (evt.which === this.keymap[key]) {
          this.key[key] = false;
        }
      }
    })

  }

  updateKey() {
    for (var key in this.key) {
      if (this.key[key]) {
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
            this.shoot()
          break;
        }
      }
    }
    return this.pos;
  }


  goForward() {
    this.dv.add(this.av)
    if (this.dv.len() > this.maxSpeed) {
      this.dv.normalize();
      this.dv.scale(this.maxSpeed,this.maxSpeed);
    }
  }

  goBackward() {
    this.dv.sub(this.av)
    if (this.dv.len() > this.maxSpeed) {
      this.dv.normalize();
      this.dv.scale(this.maxSpeed,this.maxSpeed);
    }
  }

  goLeft() {
    this.av.rotate(-this.angularAcceleration)
  }

  goRight() {

      this.av.rotate(this.angularAcceleration)
  }

  update() {
    super.update();
    this.updateKey()
    if (this.shotDelay > 0) {this.shotDelay--;} else if (this.shotDelay < 0) {this.shotDelay = 0;}
    if(this.key.up){this.showOverlay = true} else {this.showOverlay = false}
    if (!this.exists) {
      this.hitpoints = 1;
      this.dv = new Vector(0,0);
      if(this.spawnTime == 0) {
        this.pos = new Vector(Math.random()*this.game.canvasCam.width,Math.random()*this.game.canvasCam.height);
        this.spawnTime = 60;
        this.exists = true;
      }
      else {this.spawnTime--}
    }
  }

  draw() {
    if(!this.exists){return}
    super.draw();
    let TextWidth = this.game.ctx.measureText(this.name).width;
    this.game.ctx.translate(this.pos.x, this.pos.y);
    this.game.ctx.fillStyle = 'white';
    this.game.ctx.fillText(this.name,-TextWidth/2,-17)
    this.game.ctx.beginPath();
    this.game.ctx.lineWidth="4";
    this.game.ctx.strokeStyle="green";
    this.game.ctx.moveTo(-TextWidth/2,-14);
    this.game.ctx.lineTo((-TextWidth/2) + this.hitpoints*TextWidth,-14);
    this.game.ctx.stroke();
    this.game.ctx.translate(-this.pos.x, -this.pos.y);
  }

  shoot() {
    if (this.shotDelay == 0 && this.exists) {
      this.lr *= -1
      var id = shortid.generate();
      this.game.objects[id] = new Shot(this.game, this, this.lr, id);
      this.shotDelay = this.shotDelayConfig
      new Audio("./sound/shot_sound.wav").play()
    }
  }
  collide(a, b, response) {
    super.collide(a, b, response);
    if (b.constructor.name == 'Scrap') {
      b.hitpoints = 0;
      this.scrapCargo += 25;
      console.log(this.scrapCargo);
    }
  }
}
