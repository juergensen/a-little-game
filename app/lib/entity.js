'use strict';
const SAT = require('sat')
const Poly = SAT.Polygon;
const Response = SAT.Response;
const Vector = SAT.Vector;
const shortid = require('shortid');

module.exports = class Entity {
  constructor(game) {
    this.game = game;
    this.id = null;
    this.pos = new Vector(Math.random()*this.game.canvasCam.width,Math.random()*this.game.canvasCam.height);
    this.dv = new Vector(0,0); // direction Vector
    this.av = new Vector(0,1);  // acceleration Vector Wohin das das raumschif guckt
    this.hitpoints = 1;
    this.mass = 1
    this.exists = true
    this.collisionDelay = 0
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
  deleteEntity() {
    if (this.hitpoints <= 0) {
      if(this.game.objects[this.id].constructor.name == 'Player' || this.game.objects[this.id].constructor.name == 'Npc') {
        new Audio("./sound/explosion.wav").play()
        this.game.genDebri(this.id)
        if(this.game.objects[this.id].constructor.name == 'Player'){this.game.objects[this.id].exists = false;return;}
      }
      delete this.game.objects[this.id];
    }
  }
  checkCollision() {
      for (let obj2 in this.game.objects) {
        let response = new Response()
        if (this.game.objects[this.id] != this.game.objects[obj2] &&
            SAT.testPolygonPolygon(this.game.objects[this.id].hitbox, this.game.objects[obj2].hitbox, response) &&
            this.game.objects[this.id].exists && this.game.objects[obj2].exists &&
            this.game.objects[this.id].collisionDelay <= 0 && this.game.objects[obj2].collisionDelay <= 0) {
          this.collide(this.game.objects[this.id], this.game.objects[obj2], response.overlapV)
          return; // Damit der nicht weiter rechnet
        }
      }
  }
  collide(a,b, response) {
    let massAB = (b.mass+a.mass)*2;
    let dvDiff = b.dv.clone().sub(a.dv).len();
    a.dv.sub(response.clone().scale(b.mass/massAB, b.mass/massAB))
    b.dv.add(response.clone().scale(a.mass/massAB, a.mass/massAB))
    a.hitpoints -= 0.15 * dvDiff * b.mass/massAB;
    b.hitpoints -= 0.15 * dvDiff * a.mass/massAB;
    console.log(0.15 * dvDiff * b.mass/massAB)
  }
  update() {
    this.checkCollision();
    this.deleteEntity();
    if(this.exists) {
      this.pos.add(this.dv);
      this.dv.scale(0.99,0.99)
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
      if (this.pos.x < 0) {this.pos.x = 0; this.dv.x *= -1;this.av.x *= -1;}
      if (this.pos.y < 0) {this.pos.y = 0; this.dv.y *= -1;this.av.y *= -1;}
      if (this.pos.y > this.game.canvas.height) {this.pos.y = this.game.canvas.height; this.dv.y *= -1;this.av.y *= -1;}
      if (this.pos.x > this.game.canvas.width) {this.pos.x = this.game.canvas.width; this.dv.x *= -1;this.av.x *= -1;}
      this.collisionDelay--;
      if(this.collisionDelay <= 0){this.collisionDelay = 0};
    }
  }
  draw() {
    if(this.exists) {
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
}
