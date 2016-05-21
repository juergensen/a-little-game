'use strict';

const Aircraft = require('./entity.js');

module.exports = class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.objects = [];

    this.defaults = {
      acceleration: 0.1,
      angularAcceleration: 0.05,
      maxSpeed: 10,
      shotDelayConfig: 10,
      shotSpeed: 5,
      npcSpeed: 1.5,
      npcSpawnRate: 25,
      npcLimit: 10,
      drag: 0.99,
      doDrag: true
    }

    this.objects.push(new Aircraft(this));

    this.gameLoop();
  }

  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].update();
      this.objects[i].draw();
    }
  }
}
