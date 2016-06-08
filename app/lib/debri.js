'use strict';

const Entity = require('./entity.js')

module.exports = class Debri extends Entity {
  constructor(game, entity, i, id) {
    super(game);
    this.id = id;
    this.entity = entity
    this.pos = this.entity.pos.clone();
    this.dv = this.entity.dv.clone();
    this.av = this.entity.av.clone().normalize();
    this.mass = 0.33;
    this.hitpoints = 1000000;
    this.decayTime = 300;
    this.createDebri(i)
  }
  createDebri(i) {
    var debriCanvas = document.createElement("canvas");
    var debriCtx = debriCanvas.getContext("2d");
    debriCanvas.height = this.entity.skin.height / 3
    debriCanvas.width = this.entity.skin.width
    debriCtx.drawImage(this.entity.skin,
      0,
      debriCanvas.height * i + 1,
      this.entity.skin.width,
      debriCanvas.height,
      0,
      0,
      debriCanvas.width,
      debriCanvas.height
    )
    this.skin = document.createElement('img')
    this.skin.src = debriCanvas.toDataURL()
    debriCtx.clearRect(0, 0, debriCanvas.width, debriCanvas.height);
    switch (i) {
      case 0: //links
        this.pos.add(this.av.clone().perp().scale(11, 11))
        this.dv.add(this.av.clone().perp().scale(2, 2))
        break;
      case 2: //rechts
        this.pos.sub(this.av.clone().perp().scale(11, 11))
        this.dv.sub(this.av.clone().perp().scale(2, 2))
        break;
    }
    console.log(this);
  }
  update() {
  super.update();
    if (this.dv.len() <= 0.1) {
      this.hitpoints = 0
    }
  }
}
