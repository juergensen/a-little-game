'use strict';

const SAT = require('sat')
const Poly = SAT.Polygon;
const Vector = SAT.Vector;
const Response = SAT.Response;
const shortid = require('shortid');



var lr = 1
var shotDelay = 0;
var shotDelayConfig = 10;

function shoot(game) {
/*  if (shotDelay == 0 && game.player.exists) {
    lr *= -1
    game.socket.emit('shot', {
      pos:game.player.pos,
      av:game.player.av,
      dv:game.player.dv,
      lr:lr,
      ownerId:game.socket.id
    })
    shotDelay = shotDelayConfig
    new Audio("./sound/shot_sound.wav").play()//soundManager
  }*/
}

function collide(game, collidedEntity, response) {

  let massAB = (collidedEntity.mass+game.player.mass);
  let dvDiff = collidedEntity.dv.clone().sub(game.player.dv).len();
  console.log(collidedEntity.mass/massAB);
  game.player.pos.sub(response.clone().scale(collidedEntity.mass/massAB, collidedEntity.mass/massAB))
//  collidedEntity.pos.add(response.clone().scale(game.player.mass/massAB, game.player.mass/massAB))
  game.player.dv.sub(response.clone().scale(collidedEntity.mass/massAB+1, collidedEntity.mass/massAB+1))
//  collidedEntity.dv.add(response.clone().scale(game.player.mass/massAB, game.player.mass/massAB))

  game.player.hitpoints -= 0.05 * dvDiff * collidedEntity.mass/massAB;
//  collidedEntity.hitpoints -= 0.05 * dvDiff * game.player.mass/massAB;
  //console.log(0.05 * dvDiff * collidedEntity.mass/massAB)
  //  console.log("Collision",a.constructor.name,collidedEntity.constructor.name);
}

function collision(game, objects) {
  let response = new Response()
  if (game.player.id != objects.id &&
      SAT.testPolygonPolygon(game.player.hitbox, objects.hitbox, response) &&
      game.player.exists && objects.exists &&
      game.player.collisionDelay <= 0 && objects.collisionDelay <= 0) {
    console.log(game.player.id, objects.id);
    collide(game, objects, response.overlapV)
    return; // Damit der nicht weiter rechnet
  }
}
////////////////////////////////////////////////
///////////////////////////////////////////////
//////////////////////////////////////////////
var keymap = {up:87,left:65,down:83,right:68,shoot:32};
var keys = {up:false,left:false,down:false,right:false,shoot:false};
var maxSpeed = 10;
var angularAcceleration = 0.05;

function goForward(pos, av, dv) {
  dv.add(av)
  if (dv.len() > maxSpeed) {
    dv.normalize();
    dv.scale(maxSpeed,maxSpeed);
  }
}

function goBackward(pos, av, dv) {
  dv.sub(av)
  if (dv.len() > maxSpeed) {
    dv.normalize();
    dv.scale(maxSpeed,maxSpeed);
  }
}

function goLeft(pos, av, dv) {
  av.rotate(-angularAcceleration)
}

function goRight(pos, av, dv) {
  av.rotate(angularAcceleration)
}


document.addEventListener("keydown", (evt) => {
  for (let key in keymap) {
    if (evt.which === keymap[key]) {
      keys[key] = true;
    }
  }
});
document.addEventListener("keyup", (evt) => {
  for (let key in keymap) {
    if (evt.which === keymap[key]) {
      keys[key] = false;
    }
  }
})


module.exports = function (game) {
  if (game.player === undefined) {
    return;
  }

  game.player.hitbox = new Poly(game.player.pos, [
    new Vector(game.player.pos.x-game.player.skin.width,game.player.pos.y-game.player.skin.height),
    new Vector(game.player.pos.x+game.player.skin.width,game.player.pos.y-game.player.skin.height),
    new Vector(game.player.pos.x+game.player.skin.width,game.player.pos.y+game.player.skin.height),
    new Vector(game.player.pos.x-game.player.skin.width,game.player.pos.y+game.player.skin.height)
  ]);

  game.player.pos = new Vector(game.player.pos.x,game.player.pos.y)
  game.player.av = new Vector(game.player.av.x,game.player.av.y)
  game.player.dv = new Vector(game.player.dv.x,game.player.dv.y)

  var prom = new Promise(function (resolve, reject) {
    for (var key in keys) {
      if (keys[key]) {
        switch (key) {
          case "up":
          console.log("UP");
            goForward(game.player.pos,game.player.av,game.player.dv)
          break;
          case "down":
          console.log("DOWN");
            goBackward(game.player.pos,game.player.av,game.player.dv)
          break;
          case "left":
          console.log("LEFT");
            goLeft(game.player.pos,game.player.av,game.player.dv)
          break;
          case "right":
          console.log("RIGHT");
            goRight(game.player.pos,game.player.av,game.player.dv)
          break;
          case "shoot":
          console.log("SHOT");
            shoot(game)
          break;
        }
      }
    }
    //console.log(keys);
    if(game.player.exists) {
      game.player.pos.add(game.player.dv);
      game.player.dv.scale(0.99,0.99)

      game.player.hitbox.pos = game.player.pos;
      game.player.hitbox.setPoints([
        new Vector(game.player.pos.x-game.image.player.width,game.player.pos.y-game.image.player.height),
        new Vector(game.player.pos.x+game.image.player.width,game.player.pos.y-game.image.player.height),
        new Vector(game.player.pos.x+game.image.player.width,game.player.pos.y+game.image.player.height),
        new Vector(game.player.pos.x-game.image.player.width,game.player.pos.y+game.image.player.height)
      ]);
      game.player.hitbox.translate(-game.player.pos.x, -game.player.pos.y)
      game.player.hitbox.rotate(Math.atan2(game.player.av.y,game.player.av.x));
      game.player.hitbox.translate(game.player.pos.x, game.player.pos.y)

      if (game.player.pos.x < 0) {game.player.pos.x = 0; game.player.dv.x *= -1;game.player.av.x *= -1;}
      if (game.player.pos.y < 0) {game.player.pos.y = 0; game.player.dv.y *= -1;game.player.av.y *= -1;}
      if (game.player.pos.y > game.config.map.height) {game.player.pos.y = game.config.map.height; game.player.dv.y *= -1;game.player.av.y *= -1;}
      if (game.player.pos.x > game.config.map.width) {game.player.pos.x = game.config.map.width; game.player.dv.x *= -1;game.player.av.x *= -1;}
    }
    for (var key in game.drawObjects) {
      game.drawObjects[key].hitbox = new Poly(game.drawObjects[key].pos, [
        new Vector(game.drawObjects[key].pos.x-game.drawObjects[key].skin.width,game.drawObjects[key].pos.y-game.drawObjects[key].skin.height),
        new Vector(game.drawObjects[key].pos.x+game.drawObjects[key].skin.width,game.drawObjects[key].pos.y-game.drawObjects[key].skin.height),
        new Vector(game.drawObjects[key].pos.x+game.drawObjects[key].skin.width,game.drawObjects[key].pos.y+game.drawObjects[key].skin.height),
        new Vector(game.drawObjects[key].pos.x-game.drawObjects[key].skin.width,game.drawObjects[key].pos.y+game.drawObjects[key].skin.height)
      ]);
      game.drawObjects[key].pos = new Vector(game.drawObjects[key].pos.x,game.drawObjects[key].pos.y)
      game.drawObjects[key].av = new Vector(game.drawObjects[key].av.x,game.drawObjects[key].av.y)
      game.drawObjects[key].dv = new Vector(game.drawObjects[key].dv.x,game.drawObjects[key].dv.y)

      collision(game, game.drawObjects[key])

    }

    if(key.up){game.player.showOverlay = true} else {game.player.showOverlay = false}
    if (shotDelay > 0) {shotDelay--;} else if (shotDelay < 0) {shotDelay = 0;}
    resolve(game);
  }).then(function (game) {
    game.socket.emit('playerUpdate', game.player)
  })
};
