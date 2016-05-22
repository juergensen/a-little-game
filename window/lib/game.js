'use strict';

const SAT = require('sat')

const Entity = require('./entity.js');
const Player = require('./player.js')
module.exports = class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.objects = [];

    this.defaults = {
      acceleration: 0.2,
      angularAcceleration: 0.05,
      maxSpeed: 10,
      shotDelayConfig: 10,
      shotSpeed: 15,
      maxShotSpeed: 15,
      npcSpeed: 1.5,
      npcSpawnRate: 25,
      npcLimit: 10,
      drag: 0.99,
      doDrag: true,
      shotAcceleration: 1
    }

    this.objects.push(new Player(this, "Torge"));

    this.gameLoop();
  }

  checkCollision(obj) {
    if(this.objects[obj].constructor.name != 'Player') {
      for(let obj2 in this.objects) {
        if(this.objects[obj] != this.objects[obj2] &&
          this.objects[obj2].constructor.name != 'Player' &&
           SAT.testPolygonPolygon(this.objects[obj].hitbox, this.objects[obj2].hitbox)) {
          this.objects[obj].delete = true;
          this.objects[obj2].delete = true;
          return;
        }
      }
    }
    if (this.objects[obj].delete) {
       this.objects.splice(obj,1)
      //console.log("BUM");
    }
  }

  gameLoop() {
    window.requestAnimationFrame(() => this.gameLoop());
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].update();
      this.checkCollision(i);
    }
    for (var i = 0; i < this.objects.length; i++) {
      this.objects[i].draw();
    }
  }
}
