'use strict';

const Entity = require('./entity.js')

module.exports = class Shot extends Entity {
  constructor(game, player,lr, id) {
    super(game);
    this.id = id;
    this.player = player

    this.shotSpeed = this.game.defaults.shotSpeed;
    this.shotAcceleration = this.game.defaults.shotAcceleration;
    this.maxShotSpeed = this.game.defaults.maxShotSpeed;
    this.pos = this.player.pos.clone().add(this.player.av.clone().normalize().scale(4,4))
    this.pos.add(this.player.av.clone().perp().normalize().scale(lr*8,lr*8))
    this.dv = this.player.av.clone()
    this.dv.scale(this.shotSpeed,this.shotSpeed)
    this.dv.add(this.player.dv.clone())
    this.av = this.player.av.clone().scale(this.shotAcceleration, this.shotAcceleration)
    this.collisionDelay = 5;
    this.mass = 0.1
    this.hitpoints = 0.01
    this.skin = this.game.image.shot

  }
  accelerate() {
    if (this.dv.len() < this.maxShotSpeed) {
      this.dv.add(this.av)
    }
  }

  update() {
    super.update();
    this.accelerate();
    this.av.scale(0.99,0.99)
    if(this.dv.len() <= 0.1 && this.av.len() <= 0.1){this.hitpoints = 0}
  }

  shoot() {

  }
}
