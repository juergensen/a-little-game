'use strict';

const Vector = require('./vector.js')
  , EventEmitter = require('events');

module.exports = class Entity extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.pos = new Vector;
    this.dv = new Vector; // direction Vector
    this.av = new Vector;  // acceleration Vector Wohin das das raumschif guckt

    this.hitpoins = 1;

    this.skin = new Image();
    this.skin.src = "./image/player_space_ship.png";
  }

  update() {
    this.emit('update');
  }

  draw() {
    this.emit('draw');
    this.game.ctx.translate(this.pos.x, this.pos.y);
    this.game.ctx.rotate(0);
    this.game.ctx.drawImage(this.skin, -8, -8);
    this.game.ctx.rotate(0);
    this.game.ctx.translate(-this.pos.x, -this.pos.y);
  }
}
