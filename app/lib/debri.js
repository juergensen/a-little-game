'use strict';

const Entity = require('./entity.js')

module.exports = class Debri extends Entity {
    constructor(game, entity, id) {
        super(game);
        this.player = entity
        this.pos = this.player.pos.clone();
        this.dv = this.player.dv.clone();
        this.av = this.player.av.clone().normalize();
        this.skin = this.game.image.playerDebri0
        this.createDebri(id)
    }
    createDebri(id) {
        switch (id) {
            case 1:
                this.skin = this.game.image.playerDebri1
                this.pos.sub(this.av.clone().perp().scale(11,11))
                this.pos.sub(this.av.clone().normalize().scale(8,8))
                this.dv.sub(this.av.clone().perp().scale(2,2))
                break;
            case 2:
                this.skin = this.game.image.playerDebri2
                this.pos.add(this.av.clone().perp().scale(11,11))
                this.pos.sub(this.av.clone().normalize().scale(8,8))
                this.dv.add(this.av.clone().perp().scale(2,2))
                break;
            default:

        }
    }
    update() {
      super.update();
      if(this.dv.len() <= 0.1){this.hitpoints = 0}
    }
}
