'use strict';

const Entity = require('./entity.js')
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;

module.exports = class Scrab extends Entity {
  constructor(game, entity, i, id) {
    super(game);
    this.id = id;
    this.entity = entity
    this.pos = this.entity.pos.clone().sub(new Vector(32 - Math.random() * 64, 32 - Math.random() * 64));
    this.dv = this.entity.dv.clone();
    this.av = this.entity.av.clone().normalize();
    this.mass = 0.0001;
    this.hitpoints = 1000
    this.skin = this.game.image.scrap;
  }
}
