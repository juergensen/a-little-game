'use strict';

const Entity = require('./entity.js')

module.exports = class Player extends Entity {
  constructor(game, name) {
    super(game);
    this.name = name || 'Player';

    this.angularAcceleration = this.game.defaults.angularAcceleration;

    this.maxSpeed = this.game.defaults.maxSpeed;

    this.keymap = {up:87,left:65,down:83,right:68,shoot:32};
    this.key = {up:false,left:false,down:false,right:false,shoot:false};

    this.shots = [];
    this.shotDelayConfig = this.game.defaults.shotDelayConfig;

    this.shotDelay = 0;
    this.kills = 0;
    this.hitPlayer = 0;
    this.av.y = this.acceleration = this.game.defaults.acceleration;;

    document.addEventListener("keydown", (evt) => {
      for (let key in this.keymap) {
        if (evt.which === this.keymap[key]) {
          this.key[key] = true;
        }
      }
    });
    document.addEventListener("keyup", (evt) => {
      for (let key in this.keymap) {
        if (evt.which === this.keymap[key]) {
          this.key[key] = false;
        }
      }
    })

  }

  updateKey() {
    for (var key in this.key) {
      if (this.key[key]) {
        switch (key) {
          case "up":
            this.goForward()
          break;
          case "down":
            this.goBackward()
          break;
          case "left":
            this.goLeft()
          break;
          case "right":
            this.goRight()
          break;
          case "shoot":
            this.shoot()
          break;
        }
      }
    }
    return this.pos;
  }


  goForward() {
    this.dv.add(this.av)
    if (this.dv.len() > this.maxSpeed) {
      this.dv.normalize();
      this.dv.scale(this.maxSpeed,this.maxSpeed);
    }
  }

  goBackward() {
    this.dv.sub(this.av)
    if (this.dv.len() > this.maxSpeed) {
      this.dv.normalize();
      this.dv.scale(this.maxSpeed,this.maxSpeed);
    }
  }

  goLeft() {
    this.av.rotate(-this.angularAcceleration)
  }

  goRight() {

      this.av.rotate(this.angularAcceleration)
  }

  update() {
    super.update();
    this.updateKey()
    this.dv.scale(0.99,0.99)
  }

  shoot() {

  }
}