'use strict';

const Entity = require('./entity.js')

module.exports = class Shot extends Entity {
  constructor(game, player) {
    super(game);

    this.player = player

    this.shotSpeed = this.game.defaults.shotSpeed;

    this.pos = this.player.pos.clone()
    this.dv = this.player.av.clone()
    this.dv.scale(this.shotSpeed,this.shotSpeed)
    this.av = this.player.av.clone()

    this.skin.src = './image/shot.png';

  }

  update() {
    super.update();
  }

  shoot() {

  }
}
