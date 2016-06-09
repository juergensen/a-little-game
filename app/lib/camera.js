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
      this.drawCompass()
      this.drawHUD()
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
    drawCompass() {
      let ol=Math.atan2(-this.viewPortRect.h/2,-this.viewPortRect.w/2)
      let or=Math.atan2(-this.viewPortRect.h/2,+this.viewPortRect.w/2)
      let ur=Math.atan2(+this.viewPortRect.h/2,+this.viewPortRect.w/2)
      let ul=Math.atan2(+this.viewPortRect.h/2,-this.viewPortRect.w/2)
      for (var i = 0; i < this.game.playerIDs.length; i++) {
        if(this.game.objects[this.game.playerIDs[i]].constructor.name == 'Player' &&!SAT.pointInPolygon(this.game.objects[this.game.playerIDs[i]].pos, this.viewPortRect.toPolygon())) {
          let path = this.game.objects[this.game.playerIDs[i]].pos.clone().sub(new Vector(this.pos.x+this.viewPortRect.w/2,this.pos.y+this.viewPortRect.h/2));
          let compassPos = path.clone();
          let TextWidth = this.game.ctxCam.measureText(this.game.objects[this.game.playerIDs[i]].name).width;
          let NumWidth = this.game.ctxCam.measureText(Math.round(path.len())).width;
          if (ol < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < or) {
            compassPos.x*=-this.viewPortRect.h/(2*compassPos.y)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.y = 15
            if(compassPos.x > this.viewPortRect.w-(5+TextWidth/2)){compassPos.x = this.viewPortRect.w-(5+TextWidth/2)}
            if(compassPos.x < 5+TextWidth/2){compassPos.x = 5+TextWidth/2}
          }
          if (or < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < ur) {
            compassPos.x*=this.viewPortRect.w/(2*compassPos.x)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.x = this.viewPortRect.w-(5+TextWidth/2)
            if(compassPos.y > this.viewPortRect.h-15){compassPos.y = this.viewPortRect.h-15}
            if(compassPos.y < 15){compassPos.y = 15}
          }
          if (ur < Math.atan2(path.y,path.x) && Math.atan2(path.y,path.x) < ul) {
            compassPos.x*=this.viewPortRect.h/(2*compassPos.y)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.y = this.viewPortRect.h-25
            if(compassPos.x > this.viewPortRect.w-(5+TextWidth/2)){compassPos.x = this.viewPortRect.w-(5+TextWidth/2)}
            if(compassPos.x < (5+TextWidth/2)){compassPos.x = (5+TextWidth/2)}
          }
          if (ul < Math.atan2(path.y,path.x) || Math.atan2(path.y,path.x) < ol) {
            compassPos.x*=-this.viewPortRect.w/(2*compassPos.x)
            compassPos.add(new Vector(this.viewPortRect.w/2,this.viewPortRect.h/2))
            compassPos.x = (5+TextWidth/2)
            if(compassPos.y > this.viewPortRect.h){compassPos.y = this.viewPortRect.h-15}
            if(compassPos.y < 15){compassPos.y = 15}
          }
          this.game.ctxCam.fillStyle = 'white';
          this.game.ctxCam.fillText(this.game.objects[this.game.playerIDs[i]].name,compassPos.x-TextWidth/2,compassPos.y);
          this.game.ctxCam.fillText(Math.round(path.len()),compassPos.x-NumWidth/2,compassPos.y+15);
        }
      }
    }

    drawHUD() {
      if (this.followed.exists) {
        let pos = {x:10,y:10}
        let maxWidth = 300
        let height = 20
        let border = 5
        this.game.ctxCam.strokeStyle = '#8c8c8c';
        this.game.ctxCam.lineWidth=border;
        this.game.ctxCam.strokeRect(pos.x-border/2,pos.y-border/2,maxWidth+(border),height+(border));
        this.game.ctxCam.fillStyle="green";
        this.game.ctxCam.fillRect(pos.x,pos.y,maxWidth,height)
        this.game.ctxCam.fillStyle="red";
        this.game.ctxCam.fillRect(pos.x,pos.y,maxWidth-(this.followed.hitpoints*maxWidth),height)
        this.game.ctxCam.font="10px Arial";
        this.game.ctxCam.fillStyle="#68eae0";
        let text = Math.round(this.followed.hitpoints*100)+"% Leben";
        this.game.ctxCam.fillText(text, pos.x+(maxWidth/2)-(this.game.ctxCam.measureText(text).width/2),pos.y+height-5)
      } else {
        this.game.ctxCam.fillStyle="red";
        this.game.ctxCam.font="80px Arial";
        this.game.ctxCam.fillText('DEAD', (this.viewPortRect.w/2)-(this.game.ctxCam.measureText('DEAD').width/2),this.viewPortRect.h/2)
      }


    }
}
