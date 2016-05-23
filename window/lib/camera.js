'use strict';
const SAT = require('sat')
const Box = SAT.Box;
const Vector = SAT.Vector;
module.exports = class Camera {
    constructor(game) {
        this.game = game;
        this.pos = new Vector();
        this.deadZone = new Vector();
        this.viewWidth = this.game.canvasCam.width;
        this.viewHeight = this.game.canvasCam.height;
        this.followed = null;
        this.viewPortRect = new Box(this.pos, this.viewWidth, this.viewHeight)
    }

    follow(gameObject) {
        this.followed = gameObject;
    }
    update() {
        if (this.followed != null) {
            if (this.followed.pos.x - this.pos.x + this.viewWidth / 2 > this.viewWidth) {
                this.pos.x = this.followed.pos.x - (this.viewWidth - this.viewWidth / 2)
            } else if (this.followed.pos.x - this.viewWidth / 2 < this.pos.x) {
                this.pos.x = this.followed.pos.x - this.viewWidth / 2
            };
            if (this.followed.pos.y - this.pos.y + this.viewHeight / 2 > this.viewHeight) {
                this.pos.y = this.followed.pos.y - (this.viewHeight - this.viewHeight / 2)
            } else if (this.followed.pos.y - this.viewHeight / 2 < this.pos.y) {
                this.pos.y = this.followed.pos.y - this.viewHeight / 2
            };
        }
        this.viewPortRect.pos = this.pos
        if (this.pos.x < 0) {
            this.pos.x = 0
        }
        if (this.pos.y < 0) {
            this.pos.y = 0
        }
        if (this.pos.y > this.game.canvas.height - this.viewHeight) {
            this.pos.y = this.game.canvas.height - this.viewHeight
        }
        if (this.pos.x > this.game.canvas.width - this.viewWidth) {
            this.pos.x = this.game.canvas.width - this.viewWidth
        }
    }
}
