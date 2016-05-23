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
}
