'use strict';

const Entity = require('./entity.js')
const Shot = require('./shot.js')
const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;

module.exports = class Npc extends Entity {
    constructor(game) {
        super(game);
        this.pos = new Vector(Math.random()*this.game.canvas.width,Math.random()*this.game.canvas.height);
        this.angularAcceleration = this.game.defaults.angularAcceleration;
        this.maxSpeed = this.game.defaults.maxSpeed;
        this.shots = [];
        this.av.y = this.acceleration = this.game.defaults.acceleration;
        this.spawnTime = 180
        this.skin = this.game.image.npc
        this.skinOverlay = this.game.image.playerOverlay
        this.protocolExecutionTime = 0
        this.protocolDirection = 1
        this.evade = 0
        this.shotDelayConfig = this.game.defaults.shotDelayConfig;
        this.shotDelay = 0;
        this.lr = 1
    }
    goForward() {
        this.dv.add(this.av)
        if (this.dv.len() > this.maxSpeed) {
            this.dv.normalize();
            this.dv.scale(this.maxSpeed, this.maxSpeed);
        }
    }

    goBackward() {
        this.dv.sub(this.av)
        if (this.dv.len() > this.maxSpeed) {
            this.dv.normalize();
            this.dv.scale(this.maxSpeed, this.maxSpeed);
        }
    }

    goLeft() {
        this.av.rotate(-this.angularAcceleration)
    }

    goRight() {

        this.av.rotate(this.angularAcceleration)
    }
    shoot() {
      if (this.shotDelay == 0 && this.exists) {
        this.lr *= -1
        this.game.objects.push(new Shot(this.game, this, this.lr));
        this.shotDelay = this.shotDelayConfig
        new Audio("./sound/shot_sound.wav").play()
      }
    }
    evadeProtocol() {
        this.evade = 0
        if (this.pos.x <= 800 && this.av.x < 0 && this.dv.len() != 0) {
            if (Math.atan2(this.av.y, this.av.x) >= 0) {
                this.protocolDirection = 0
            } else {
                this.protocolDirection = 1
            };
            this.evade = 1;
        } else if (this.pos.x >= this.game.canvas.width - 800 && this.av.x > 0 && this.dv.len() != 0) {
            if (Math.atan2(this.av.y, this.av.x) <= 0) {
                this.protocolDirection = 0
            } else {
                this.protocolDirection = 1
            };
            this.evade = 1;
        } else if (this.pos.y <= 800 && this.av.y < 0 && this.dv.len() != 0) {
            if (Math.atan2(this.av.y, this.av.x) <= -Math.PI / 2) {
                this.protocolDirection = 0
            } else {
                this.protocolDirection = 1
            };
            this.evade = 1;
        } else if (this.pos.y >= this.game.canvas.height - 800 && this.av.y > 0 && this.dv.len() != 0) {
            if (Math.atan2(this.av.y, this.av.x) <= Math.PI / 2) {
                this.protocolDirection = 0
            } else {
                this.protocolDirection = 1
            };
            this.evade = 1;
        }
    }
    movingProtocolRandom() {
        this.goForward();
        if (this.protocolExecutionTime <= 0) {
            this.protocolExecutionTime = Math.random() * 300;
            this.protocolDirection = Math.round(Math.random() * 3)
        }
        this.evadeProtocol()
        if (this.protocolDirection == 0 && (Math.round(Math.random()) == 0 || this.evade)) {
            this.goLeft();
        }
        if (this.protocolDirection == 1 && (Math.round(Math.random()) == 0 || this.evade)) {
            this.goRight()
        }
        this.protocolExecutionTime--
    }
    movingProtocolTargetPlayer() {
        if(this.game.objects[this.findClosestPlayerIndex()].pos.clone().sub(this.pos.clone()).len()>=200){this.goForward()}
        this.shoot()
        this.rad = -Math.atan2(this.game.objects[this.findClosestPlayerIndex()].pos.clone().sub(this.pos.clone()).y, this.game.objects[this.findClosestPlayerIndex()].pos.clone().sub(this.pos.clone()).x) + Math.atan2(this.av.y, this.av.x)
        if (this.rad > 0 && this.rad < Math.PI) {
            this.protocolDirection = 0;
        }
        else if (this.rad > Math.PI || this.rad < 0) {
            this.protocolDirection = 1;
        }
        else {
          Math.round(Math.random());
        }
        //this.evadeProtocol()

        if (this.protocolDirection == 0) {
            this.goLeft();
        }
        if (this.protocolDirection == 1) {
            this.goRight()
        }
    }
    findClosestPlayerIndex() {
        let min = this.game.objects[0].pos.clone().sub(this.pos.clone()).len()
        let minIndex = 0;
        for (var i = 0; i < this.game.playerCount; i++) {
            if(!this.game.objects[i].exists){continue;}
            if (this.game.objects[i].pos.clone().sub(this.pos.clone()).len() < min) {
                minIndex = i;
                min = this.game.objects[i].pos.clone().sub(this.pos.clone()).len()
            }
        }
        return minIndex
    }
    chooseProtocol() {
        if (this.game.objects[this.findClosestPlayerIndex()].pos.clone().sub(this.pos.clone()).len() <= 1200 ) {
            this.movingProtocolTargetPlayer()
        } else {
            this.movingProtocolRandom()
        }
    }
    update() {
        super.update();
        this.chooseProtocol()
        if (this.shotDelay > 0) {this.shotDelay--;} else if (this.shotDelay < 0) {this.shotDelay = 0;}
    }
}
