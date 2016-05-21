'use strict';

const Vector = require('sat').Vector
  , EventEmitter = require('events');

module.exports = class Entity extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.pos = new Vector(50,Math.random()*this.game.canvas.height);
    this.dv = new Vector(0,0); // direction Vector
    this.av = new Vector(0,1);  // acceleration Vector Wohin das das raumschif guckt

    this.hitpoins = 1;

    this.skin = new Image();
    this.skin.src = "./image/player_space_ship.png";
  }

  update() {
    this.pos.add(this.dv);
    if (this.pos.x < 0) { this.pos.x = 0 }
    if (this.pos.y < 0) { this.pos.y = 0 }
    if (this.pos.x > this.game.canvas.width) { this.pos.x = this.game.canvas.width }
    if (this.pos.y > this.game.canvas.height) { this.pos.y = this.game.canvas.height }
  }
  draw() {
    this.emit('draw');
    this.game.ctx.translate(this.pos.x, this.pos.y);
    this.game.ctx.rotate(Math.atan2(this.av.y,this.av.x));
    this.game.ctx.drawImage(this.skin, -8, -8);
    this.game.ctx.rotate(-Math.atan2(this.av.y,this.av.x));
    this.game.ctx.translate(-this.pos.x, -this.pos.y);
  }
}
