'use strict';

const Entity = require('./entity.js')

module.exports = class Debri extends Entity {
    constructor(game, entity) {
        super(game);
        this.entity = entity

        this.debris = {
          left:{
            pos:  this.entity.pos.clone().sub(this.av.clone().perp().scale(11,11)),
            dv:   this.entity.pos.clone().sub(this.av.clone().normalize().scale(8,8)),
            av:   this.entity.dv.clone().sub(this.av.clone().perp().scale(2,2)),
            skin:undefined
          },
          middle:{
            pos:  this.entity.pos.clone(),
            dv:   this.entity.dv.clone(),
            av:   this.entity.av.clone().normalize(),
            skin:undefined
          },
          right:{
            pos:  this.entity.pos.clone().add(this.av.clone().perp().scale(11,11)),
            dv:   this.entity.pos.clone().sub(this.av.clone().normalize().scale(8,8)),
            av:   this.entity.dv.clone().add(this.av.clone().perp().scale(2,2)),
            skin:undefined
          }
        }
        this.createDebri()
    }
    createDebri() {
        var debriCanvas = document.createElement("canvas");
        var debriCtx = debriCanvas.getContext("2d");
        debriCanvas.height = this.entity.skin.height/3
        debriCanvas.width = this.entity.skin.width
        for (var key in this.debris) {
          if (key == "left") {var i = 0} else
          if (key == "middle") {var i = 1} else
          if (key == "right") {var i = 2}
          console.log(i);

          debriCtx.drawImage( this.entity.skin,
                              0,
                              debriCanvas.height*i,
                              this.entity.skin.width,
                              debriCanvas.height,
                              0,
                              0,
                              debriCanvas.width,
                              debriCanvas.height
                            )

          this.debris[key].skin = document.createElement('img')
          this.debris[key].skin.src = debriCanvas.toDataURL()
          debriCtx.clearRect(0,0,debriCanvas.width,debriCanvas.height);
        }
    }
    update() {
      super.update();
      //if(this.dv.len() <= 0.1){this.hitpoints = 0}
    }
    draw() {
      if(this.exists) {
        this.game.ctx.lineWidth="1";
        this.game.ctx.strokeStyle="black";
        for (var key in this.debris) {
          this.game.ctx.translate(this.debris[key].pos.x, this.debris[key].pos.y);
          this.game.ctx.rotate(Math.atan2(this.debris[key].av.y,this.debris[key].av.x));
          this.game.ctx.drawImage(this.debris[key].skin, -this.debris[key].skin.width/2, -this.debris[key].skin.height/2);
          this.game.ctx.rotate(-Math.atan2(this.debris[key].av.y,this.debris[key].av.x));
          this.game.ctx.translate(-this.debris[key].pos.x, -this.debris[key].pos.y);
        }
      }
    }
}
