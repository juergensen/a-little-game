'use strict';

const Entity = require('./entity.js')
const Shot = require('./shot.js')
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;

module.exports = class Npc extends Entity {
  constructor(game) {
    super(game);
    this.angularAcceleration = this.game.defaults.angularAcceleration;
    this.maxSpeed = this.game.defaults.maxSpeed;
    this.shots = [];
    this.av.y = this.acceleration = this.game.defaults.acceleration;;
    this.lr = 1
    this.spawnTime = 180
    this.skin = this.game.image.npc
    this.skinOverlay = this.game.image.playerOverlay
    this.protocolExecutionTime = 0
    this.protocolDirection = 0
    this.evade = 0
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
  movingProtocolRandom() {
    this.goForward();
    if(this.protocolExecutionTime <= 0){this.protocolExecutionTime = Math.random()*300;this.protocolDirection=Math.round(Math.random()*3)}
    if(this.pos.x <= 800 && this.av.x < 0){if(Math.atan2(this.av.y,this.av.x) >= 0){this.protocolDirection=0}else{this.protocolDirection=1}; this.evade = 1;}
    else if(this.pos.x >= this.game.canvas.width-800 && this.av.x > 0){if(Math.atan2(this.av.y,this.av.x) <= 0){this.protocolDirection=0}else{this.protocolDirection=1}; this.evade = 1;}
    else if(this.pos.y <= 800 && this.av.y < 0){if(Math.atan2(this.av.y,this.av.x) <= -Math.PI/2){this.protocolDirection=0}else{this.protocolDirection=1}; this.evade = 1;}
    else if(this.pos.y >= this.game.canvas.height-800 && this.av.y > 0){if(Math.atan2(this.av.y,this.av.x) <= Math.PI/2){this.protocolDirection=0}else{this.protocolDirection=1}; this.evade = 1;}
    if(this.protocolDirection == 0 && (Math.round(Math.random()) == 0 || this.evade)){
      this.goLeft();
    }
    if(this.protocolDirection == 1 && (Math.round(Math.random()) == 0 || this.evade)) {
      this.goRight()
    }
    this.protocolExecutionTime--
    this.evade = 0
  }
  movingProtocolTargetPlayer() {

  }
  update() {
    super.update();
    this.movingProtocolRandom()
  }
}
