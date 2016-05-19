'use strict';
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var x = 0;

var playerImg = document.getElementById("playerImg");
var npcImg = document.getElementById("npcImg");

var config = {
  shootDelay:0.5*20,
  playerSpeed:5,
  npcSpeed:2,
  timer:30*20
}
var Game = {
  paused:true,
  finished:false,
  npcsFineshed:0,
  npcs:[
    {pos:[240,100]},
    {pos:[300,120]},
    {pos:[150,10]}
  ],
  players:[
    {
      name:"supermomme",
      kills:0,
      shootDelay:0,
      shootDelayReadable:0,
      pos:[50,0],
      keyNum:[87,65,83,68,32],
      keyTrig:[false,false,false,false,false],
      keyInfo:{up:0,left:1,down:2,right:3,shoot:4}
    },
    {
      name:"Play ers",
      kills:0,
      shootDelay:0,
      shootDelayReadable:0,
      pos:[50,0],
      keyNum:[38,37,40,39,13],
      keyTrig:[false,false,false,false,false],
      keyInfo:{up:0,left:1,down:2,right:3,shoot:4}
    }
  ]

}


///Key Updater
document.addEventListener("keydown", function (key) {
  document.getElementById('keynum').innerHTML = key.which
  for (var i = 0; i < Game.players.length; i++) {
    for (var r = 0; r < Game.players[i].keyNum.length; r++) {
      if (key.which === Game.players[i].keyNum[r]) {
        Game.players[i].keyTrig[r] = true
      }
    }
  }
  if (key.which === 27) {
    pause().toggle();
  }
});

document.addEventListener("keyup", function (key) {
  for (var i = 0; i < Game.players.length; i++) {
    for (var r = 0; r < Game.players[i].keyNum.length; r++) {
      if (key.which === Game.players[i].keyNum[r]) {
        Game.players[i].keyTrig[r] = false
      }
    }
  }
});
//Key Updater End

//Pause Funktion
function pause() {
  var result = {}
  result.pause = function () {
    console.log("Pause")
    Game.paused = true;
  }
  result.continue = function () {
    console.log("Continue");
      Game.paused = false;
  }
  result.toggle = function () {
    if (Game.paused) {
      console.log("Continue")
      Game.paused = false;
    } else {
      console.log("Pause");
      Game.paused = true;
    }
  }
  result.finish = function () {

  }
  return result;
}
//Pause Funktion End


//Set Player Pos
for (var i = 0; i < Game.players.length; i++) {
  Game.players[i]
  let pos = canvas.height / Game.players.length * (i+(1/Game.players.length))
  Game.players[i].pos[1] = pos;
}
//Set Player Pos End
var sincos = function() {
  x += 0.1;
//  console.log(x,Math.sin(x),Math.cos(x));

}

setInterval(function () {
  if (!Game.paused && !Game.finished) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < Game.players.length; i++) {
      //Player Move
      if (Game.players[i].keyTrig[0]) {
        Game.players[i].pos[1] -= config.playerSpeed
      }
      if (Game.players[i].keyTrig[2]) {
        Game.players[i].pos[1] += config.playerSpeed
      }
      if (Game.players[i].keyTrig[1]) {
        Game.players[i].pos[0] -= config.playerSpeed
      }
      if (Game.players[i].keyTrig[3]) {
        Game.players[i].pos[0] += config.playerSpeed
      }

      if (Game.players[i].pos[0] >= canvas.width-10) {
        Game.players[i].pos[0] = canvas.width-10
      }
      if (Game.players[i].pos[0] <= 0) {
        Game.players[i].pos[0] = 0
      }
      if (Game.players[i].pos[1] >= canvas.height-10) {
        Game.players[i].pos[1] = canvas.height-10
      }
      if (Game.players[i].pos[1] <= 0) {
        Game.players[i].pos[1] = 0
      }
      //Player Move End
      sincos()
      //NPC SHOOT
      if (Game.players[i].keyTrig[4] && Game.players[i].shootDelay == 0) {
        Game.players[i].shootDelay = config.shootDelay;
        for (var r = 0; r < Game.npcs.length; r++) {
          if (Game.players[i].pos[1]+5 >= Game.npcs[r].pos[1] && Game.players[i].pos[1]-5 <= Game.npcs[r].pos[1]) {
            Game.npcs.splice(r, 1);
            Game.players[i].kills++;
          }
        }
      }
      if (Game.players[i].shootDelay > 0) { Game.players[i].shootDelay--; }
      Game.players[i].shootDelayReadable = Math.round(Game.players[i].shootDelay/20*10)/10;
      document.getElementById('shootDelayPlayer1').innerHTML = Game.players[0].shootDelayReadable;
      //NPC SHOOT END

      //Player Spawn
      context.font = "10px Arial";
      context.drawImage(playerImg, Game.players[i].pos[0], Game.players[i].pos[1]);
      context.fillText(Game.players[i].name, Game.players[i].pos[0]-context.measureText(Game.players[i].name).width/2+5, Game.players[i].pos[1]+20);
      //Player Spawn End
    }//FOR LOOP
    //NPC Move
    for (var i = 0; i < Game.npcs.length; i++) {
      Game.npcs[i].pos[0]  -= config.npcSpeed;
      if (Game.npcs[i].pos[0] <= 0) {
        Game.npcsFineshed++;
        Game.npcs.splice(i, 1);
      } else {context.drawImage(npcImg, Game.npcs[i].pos[0], Game.npcs[i].pos[1]);}
    }
    //NPC Move End

    //NPC Spawner
    if (Math.round(Math.random() * (25 - 0) + 0) == 0) {
      Game.npcs.push({pos:[canvas.width-20,Math.random() * (canvas.height - 10) + 10]})
    }
    //NPC Spawner END
    //IF FINISHED
    config.timer--;
    document.getElementById('timer').innerHTML = Math.round(config.timer/20*10)/10;
    if (config.timer <= 0) {
      Game.finished = true;
    }
    //IF FINISHED END

  } else if (Game.finished) {

    context.font = "30px Arial";
    context.fillText("Finished", canvas.width/2-context.measureText("Finished").width/2, canvas.height/2);

    context.font = "20px Arial";
    context.fillText("NPCs Finished: "+Game.npcsFineshed, 0, canvas.height);
    for (var i = 0; i < Game.players.length; i++) {
      context.fillText(Game.players[i].name+": "+Game.players[i].kills,canvas.width-context.measureText(Game.players[i].name+": "+Game.players[i].kills).width,canvas.height-20*i);
    }

  } else if (Game.paused) {

    context.font = "30px Arial";
    let txt = "Pause";
    context.fillText(txt, canvas.width/2-context.measureText(txt).width/2, canvas.height/2);

  }
}, 50)
