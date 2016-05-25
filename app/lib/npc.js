'use strict';

const Entity = require('./entity.js')

module.exports = class Npc extends Entity {
  constructor(game) {
    super(game);
    this.pos =
    this.av =
    this.dv =
    this.angularAcceleration = this.game.defaults.angularAcceleration;
    this.maxSpeed = this.game.defaults.maxSpeed;
    this.shots = [];
    this.av.y = this.acceleration = this.game.defaults.acceleration;;
    this.lr = 1
    this.spawnTime = 180
    this.skin = this.game.image.npc
    this.skinOverlay = this.game.image.playerOverlay
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

  }
  movingProtocolTargetPlayer() {

  }
}
