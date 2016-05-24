'use strict';
const SAT = require('sat')
const Box = SAT.Box;
const Vector = SAT.Vector;
module.exports = class Camera {
    constructor(game) {
        this.game = game;
        this.pos = new Vector();
        this.deadZone = new Vector();
        this.followed = null;
        this.viewPortRect = new Box(this.pos, this.game.canvasCam.width, this.game.canvasCam.height)
    }

    follow(gameObject) {
        this.followed = gameObject;
    }
    update() {
      this.viewPortRect = new Box(this.pos, this.game.canvasCam.width, this.game.canvasCam.height)
        if (this.followed != null) {
            if (this.followed.pos.x - this.pos.x + this.game.canvasCam.width / 2 > this.game.canvasCam.width) {
                this.pos.x = this.followed.pos.x - (this.game.canvasCam.width - this.game.canvasCam.width / 2)
            } else if (this.followed.pos.x - this.game.canvasCam.width / 2 < this.pos.x) {
                this.pos.x = this.followed.pos.x - this.game.canvasCam.width / 2
            };
            if (this.followed.pos.y - this.pos.y + this.game.canvasCam.height / 2 > this.game.canvasCam.height) {
                this.pos.y = this.followed.pos.y - (this.game.canvasCam.height - this.game.canvasCam.height / 2)
            } else if (this.followed.pos.y - this.game.canvasCam.height / 2 < this.pos.y) {
                this.pos.y = this.followed.pos.y - this.game.canvasCam.height / 2
            };
        }
        this.viewPortRect.pos = this.pos
        if (this.pos.x < 0) {
            this.pos.x = 0
        }
        if (this.pos.y < 0) {
            this.pos.y = 0
        }
        if (this.pos.y > this.game.canvas.height - this.game.canvasCam.height) {
            this.pos.y = this.game.canvas.height - this.game.canvasCam.height
        }
        if (this.pos.x > this.game.canvas.width - this.game.canvasCam.width) {
            this.pos.x = this.game.canvas.width - this.game.canvasCam.width
        }
    }
    drawCompass(i) {
      let ol=Math.atan2(-this.viewPortRect.h/2,-this.viewPortRect.w/2)
      let or=Math.atan2(-this.viewPortRect.h/2,+this.viewPortRect.w/2)
      let ur=Math.atan2(+this.viewPortRect.h/2,+this.viewPortRect.w/2)
      let ul=Math.atan2(+this.viewPortRect.h/2,-this.viewPortRect.w/2)
        if(this.game.objects[i].constructor.name == 'Player' &&!SAT.pointInPolygon(this.game.objects[i].pos, this.viewPortRect.toPolygon())) {
          let path = this.game.objects[i].pos.clone().sub(new Vector(this.pos.x+this.viewPortRect.w/2,this.pos.y+this.viewPortRect.h/2));
          let compassPos = path.clone();
          let TextWidth = this.game.ctxCam.measureText(this.game.objects[i].name).width;
          let NumWidth = this.game.ctxCam.measureText(Math.round(path.len())).width;
          if (ol < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < or) {
            compassPos.x*=-this.viewPortRect.h/(2*compassPos.y)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.y = 15
            if(compassPos.x > this.viewPortRect.w-5+TextWidth/2){compassPos.x = this.viewPortRect.w-5+TextWidth/2}
            if(compassPos.x < 5+TextWidth/2){compassPos.x = 5+TextWidth/2}
          }
          if (or < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < ur) {
            compassPos.x*=this.viewPortRect.w/(2*compassPos.x)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.x = this.viewPortRect.w-5+TextWidth/2
            if(compassPos.y > this.viewPortRect.h-15){compassPos.y = this.viewPortRect.h-15}
            if(compassPos.y < 15){compassPos.y = 15}
          }
          if (ur < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < ul) {
            compassPos.x*=this.viewPortRect.h/(2*compassPos.y)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.y = this.viewPortRect.h-15
            if(compassPos.x > this.viewPortRect.w-5+TextWidth/2){compassPos.x = this.viewPortRect.w-5+TextWidth/2}
            if(compassPos.x < 5+TextWidth/2){compassPos.x = 5+TextWidth/2}
          }
          if (ul < Math.atan2(path.y,path.x) || Math.atan2(path.y,path.x) < ol) {
            compassPos.x*=-this.viewPortRect.w/(2*compassPos.x)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.x = 5+TextWidth/2
            if(compassPos.y > this.viewPortRect.h){compassPos.y = this.viewPortRect.h-15}
            if(compassPos.y < 15){compassPos.y = 15}
          }
          this.game.ctxCam.fillText(this.game.objects[i].name,compassPos.x-TextWidth/2,compassPos.y);
          this.game.ctxCam.fillText(Math.round(path.len()),compassPos.x-NumWidth/2,compassPos.y+15);
        }
    }
}
