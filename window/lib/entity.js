'use strict';
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;

module.exports = class Entity {
  constructor(game) {
    this.game = game;
    this.pos = new Vector(50,Math.random()*this.game.canvas.height);
    this.dv = new Vector(0,0); // direction Vector
    this.av = new Vector(0,1);  // acceleration Vector Wohin das das raumschif guckt
<<<<<<< HEAD
    this.hitpoins = 1;
    this.delete = false;
>>>>>>> 2e07c22f09459a44fac8dbb04dc0346f1c9d3305

    this.skin = new Image();
    this.skinOverlay = new Image();
    this.showOverlay = false;
    this.skin.src = "./image/player_space_ship.png";

    this.hitbox = new Poly(this.pos, [
      new Vector(this.pos.x-this.skin.width/2,this.pos.y-this.skin.height/2),
      new Vector(this.pos.x+this.skin.width/2,this.pos.y-this.skin.height/2),
      new Vector(this.pos.x+this.skin.width/2,this.pos.y+this.skin.height/2),
      new Vector(this.pos.x-this.skin.width/2,this.pos.y+this.skin.height/2)
    ]);
  }

  update() {
    this.pos.add(this.dv);
    this.hitbox.pos = this.pos;
    this.hitbox.setPoints([
      new Vector(this.pos.x-this.skin.width/2,this.pos.y-this.skin.height/2),
      new Vector(this.pos.x+this.skin.width/2,this.pos.y-this.skin.height/2),
      new Vector(this.pos.x+this.skin.width/2,this.pos.y+this.skin.height/2),
      new Vector(this.pos.x-this.skin.width/2,this.pos.y+this.skin.height/2)
    ]);
    this.hitbox.translate(-this.pos.x, -this.pos.y)
    this.hitbox.rotate(Math.atan2(this.av.y,this.av.x));
    this.hitbox.translate(this.pos.x, this.pos.y)
    if (this.pos.x < 0) {/*this.pos.x = 0*/ this.dv.x *= -1;this.av.x *= -1 }
    if (this.pos.y < 0) {/*this.pos.y = 0*/ this.dv.y *= -1;this.av.y *= -1 }
    if (this.pos.y > this.game.canvas.height) {/*this.pos.y = this.game.canvas.height*/ this.dv.y *= -1;this.av.y *= -1 }
    if (this.pos.x > this.game.canvas.width) {/*this.pos.x = this.game.canvas.width*/ this.dv.x *= -1;this.av.x *= -1 }

  }
  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.hitbox.calcPoints[0].x,this.hitbox.calcPoints[0].y);
    for (var i = 1; i < this.hitbox.calcPoints.length; i++) {
      this.game.ctx.lineTo(this.hitbox.calcPoints[i].x,this.hitbox.calcPoints[i].y)
    }
    this.game.ctx.closePath();
    this.game.ctx.stroke()
    this.game.ctx.translate(this.pos.x, this.pos.y);
    this.game.ctx.rotate(Math.atan2(this.av.y,this.av.x));
    this.game.ctx.drawImage(this.skin, -this.skin.width/2, -this.skin.height/2);
    if(this.showOverlay){ this.game.ctx.drawImage(this.skinOverlay, -this.skinOverlay.width/2, -this.skinOverlay.height/2);};
    this.game.ctx.rotate(-Math.atan2(this.av.y,this.av.x));
    this.game.ctx.translate(-this.pos.x, -this.pos.y);
  }
}
