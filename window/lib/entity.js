'use strict';
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;

module.exports = class Entity {
  constructor(game) {
    this.game = game;
    this.pos = new Vector(50,50);
    this.dv = new Vector(0,0); // direction Vector
    this.av = new Vector(0,1);  // acceleration Vector Wohin das das raumschif guckt
    this.hitpoints = 1;

    this.skin = this.game.image.err
    this.skinOverlay = null
    this.showOverlay = false;

    this.hitbox = new Poly(this.pos, [
      new Vector(this.pos.x-this.skin.width,this.pos.y-this.skin.height),
      new Vector(this.pos.x+this.skin.width,this.pos.y-this.skin.height),
      new Vector(this.pos.x+this.skin.width,this.pos.y+this.skin.height),
      new Vector(this.pos.x-this.skin.width,this.pos.y+this.skin.height)
    ]);
  }

  update() {
    this.pos.add(this.dv);
    this.hitbox.pos = this.pos;
    this.hitbox.setPoints([
      new Vector(this.pos.x-this.skin.width,this.pos.y-this.skin.height),
      new Vector(this.pos.x+this.skin.width,this.pos.y-this.skin.height),
      new Vector(this.pos.x+this.skin.width,this.pos.y+this.skin.height),
      new Vector(this.pos.x-this.skin.width,this.pos.y+this.skin.height)
    ]);
    this.hitbox.translate(-this.pos.x, -this.pos.y)
    this.hitbox.rotate(Math.atan2(this.av.y,this.av.x));
    this.hitbox.translate(this.pos.x, this.pos.y)
    if (this.pos.x < 0) {this.pos.x = 0; this.dv.x *= -1;this.av.x *= -1 }
    if (this.pos.y < 0) {this.pos.y = 0; this.dv.y *= -1;this.av.y *= -1 }
    if (this.pos.y > this.game.canvas.height) {this.pos.y = this.game.canvas.height; this.dv.y *= -1;this.av.y *= -1 }
    if (this.pos.x > this.game.canvas.width) {this.pos.x = this.game.canvas.width; this.dv.x *= -1;this.av.x *= -1 }

  }
  draw() {
    this.game.ctx.lineWidth="1";
    this.game.ctx.strokeStyle="black";
    this.game.ctx.translate(this.pos.x, this.pos.y);
    this.game.ctx.rotate(Math.atan2(this.av.y,this.av.x));
    this.game.ctx.drawImage(this.skin, -this.skin.width/2, -this.skin.height/2);
    if(this.showOverlay){ this.game.ctx.drawImage(this.skinOverlay, -this.skinOverlay.width/2, -this.skinOverlay.height/2);};
    this.game.ctx.rotate(-Math.atan2(this.av.y,this.av.x));
    this.game.ctx.translate(-this.pos.x, -this.pos.y);
  }
}
