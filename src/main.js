// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
// hud canvas
let hudCanvas = document.getElementById("hud");
let ctxHud = hudCanvas.getContext("2d");

let frames = 0;
let interval = undefined;
let enemies = [];
let boss;
let hairballs = [];
let fishBar = [];
let score = 0;
let waveTime = 0;
let bossTime = false;
let playAlarm = true;

let gameTrack = new Audio();
gameTrack.src = "./sounds/MegaMan2CatLoop.mp3";
gameTrack.loop = true;
gameTrack.volume = 0.6;

let bossTrack = new Audio();
bossTrack.src = "./sounds/Undertale - AsgoreCat.mp3";
bossTrack.loop = true;

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
let cat = createCat(catChosen);

let fondo = new Background(
  canvas.width,
  canvas.height,
  "./images/gameBackground.png"
);
let keylogger = new keyLogger();

function turnOffInvincibility(cat) {
  setTimeout(() => {
    cat.toggleInvincibility();
    cat.toggleDamage();
  }, globalConst.invincibilityTime);
}

function fillHealthBar(cat, fishArray) {
  for (let index = 0; index < cat.health; index++) {
    fishArray.push(
      new Fish(
        globalConst.fishWidth,
        globalConst.fishHeight,
        "./images/fish.png"
      )
    );
  }
}

function createCat(catChoice) {
  let newCat = new Cat(
    globalConst.idleSpriteWidth / globalConst.cols,
    globalConst.idleSpriteHeight,
    `./images/${catChoice}-idle-spriteBig.png`,
    globalConst.catHealth
  );
  // center cat in canvas
  // divide by 2 total width and total height of cat
  newCat.x = canvas.width / 2 - newCat.width / 2;
  newCat.y = canvas.height / 2 - newCat.height / 2;
  return newCat;
}

function generateEnemies() {
  // if (!(frames % 60 === 0)) return;
  if (frames % 30 === 0) {
    let enemy = new Enemy(
      globalConst.demonSpriteWidth / globalConst.cols,
      globalConst.demonSpriteHeight,
      `./images/demon-white-sprite.png`,
      globalConst.demonPoints,
      globalConst.enemyHealth,
      globalConst.enemySpeed
    );
    enemy.chooseSpawnPoint(canvas.width, canvas.height);
    let enemyP = new Enemy(
      globalConst.pickleSpriteWidth / globalConst.cols,
      globalConst.pickleSpriteHeight,
      `./images/pickleSpriteSmall.png`,
      globalConst.picklePoints,
      globalConst.enemyHealth,
      globalConst.pickleSpeed
    );
    enemyP.chooseSpawnPoint(canvas.width, canvas.height);
    enemies.push(enemy);
    enemies.push(enemyP);
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (cat.isTouching(enemy) && !cat.invincible) {
      let hurtSound = new Audio();
      hurtSound.src = "./sounds/short-sharp-meow.wav";
      hurtSound.play();
      cat.health--;
      cat.toggleDamage();
      fishBar.shift();
      if (cat.health > 0) {
        cat.toggleInvincibility();
        // fire a timeout to shift invincibility
        turnOffInvincibility(cat);
      }
    }
    enemy.updateFrame(frames);
    enemy.draw(ctx);
    enemy.move(0, canvas.width, canvas.height, 0, cat);
  });
}

function drawBoss() {
  if (cat.isTouching(boss) && !cat.invincible) {
    let hurtSound = new Audio();
    hurtSound.src = "./sounds/short-sharp-meow.wav";
    hurtSound.play();
    cat.health--;
    cat.toggleDamage();
    fishBar.shift();
    if (cat.health > 0) {
      cat.toggleInvincibility();
      // fire a timeout to shift invincibility
      turnOffInvincibility(cat);
    }
  }

  boss.updateFrame(frames);
  boss.draw(ctx);
  boss.move(0, canvas.width, canvas.height, 0, cat);
  // draw boss health bar
  ctx.fillStyle = "red";
  ctx.fillRect(
    boss.x,
    boss.y - 40,
    boss.width * (boss.health / globalConst.bossHealth),
    30
  );
}

function drawHairballs() {
  hairballs.forEach((hairball, index) => {
    // if hairball is out of canvas, delete it from the array
    if (
      hairball.x > canvas.width ||
      hairball.x < 0 ||
      hairball.y > canvas.height ||
      hairball.y < 0
    )
      return hairballs.splice(index, 1);
    hairball.draw(ctx);
    hairball.move(globalConst.bulletSpeed);
  });
}

function detectCollitions(bullets, enemies) {
  enemies.forEach((enemy, indexEnemy) => {
    bullets.forEach((bullet, indexBullet) => {
      if (bullet.isTouching(enemy)) {
        let enemyHealth = enemy.receiveDamage(bullet.damage);
        bullets.splice(indexBullet, 1);
        if (enemyHealth <= 0) {
          score += enemy.points;
          enemies.splice(indexEnemy, 1);
        }
      }
    });
  });
}

function gameOver() {
  let gameOverImg = new Image();
  gameOverImg.src = "./images/gameOver.png";
  gameOverImg.onload = () => {
    ctx.drawImage(
      gameOverImg,
      canvas.width / 2 - globalConst.goImgWidth,
      canvas.height / 2 - globalConst.goImgHeight,
      globalConst.goImgWidth * 2,
      globalConst.goImgHeight * 2
    );
  };
  let tryAgainImg = new Image();
  tryAgainImg.src = "./images/tryAgain.png";
  tryAgainImg.onload = () => {
    ctx.drawImage(
      tryAgainImg,
      canvas.width / 2 - globalConst.tryImgWidth / 2,
      canvas.height / 2 -
        globalConst.tryImgHeight +
        globalConst.goImgHeight +
        10,
      globalConst.tryImgWidth,
      globalConst.tryImgHeight
    );
  };
  clearInterval(interval);
  interval = undefined;
}

function winGame() {
  let winImg = new Image();
  winImg.src = "./images/youWin.png";
  winImg.onload = () => {
    ctx.drawImage(
      winImg,
      canvas.width / 2 - globalConst.winImgWidth,
      canvas.height / 2 - globalConst.winImgHeight,
      globalConst.winImgWidth * 2,
      globalConst.winImgHeight * 2
    );
  };
  let tryAgainImg = new Image();
  tryAgainImg.src = "./images/tryAgain.png";
  tryAgainImg.onload = () => {
    ctx.drawImage(
      tryAgainImg,
      canvas.width / 2 - globalConst.tryImgWidth / 2,
      canvas.height / 2 -
        globalConst.tryImgHeight +
        globalConst.winImgHeight +
        30,
      globalConst.tryImgWidth,
      globalConst.tryImgHeight
    );
  };
  clearInterval(interval);
  interval = undefined;
}

function start() {
  interval = setInterval(update, 1000 / 60);
}

function restart() {
  if (interval !== undefined) return;
  bossTrack.pause();
  bossTrack.currentTime = 0;
  gameTrack.pause();
  gameTrack.currentTime = 0;
  frames = 0;
  enemies = [];
  boss = {};
  hairballs = [];
  fishBar = [];
  score = 0;
  interval = undefined;
  bossTime = false;
  playAlarm = true;
  keylogger = new keyLogger();
  gameTrack.play();
  cat = createCat(catChosen);
  fillHealthBar(cat, fishBar);
  start();
}

function update() {
  frames++;
  waveTime = frames / 60;
  // canvas world
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fondo.draw(ctx);
  cat.updateFrame(frames, catChosen);
  cat.draw(ctx);
  // move cat if it has an active direction
  if (cat.direction)
    cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
  detectCollitions(hairballs, enemies);
  // generate enemies during a period of time
  if (waveTime < globalConst.waveTime) {
    generateEnemies();
  } else if (waveTime > globalConst.waveTime && enemies.length === 0) {
    gameTrack.pause();
    bossTime = true;
  }
  drawHairballs();
  if (enemies.length > 0) {
    drawEnemies();
  }
  if (bossTime) {
    if (playAlarm) {
      let alarmSound = new Audio();
      alarmSound.src = "./sounds/alarmSound.wav";
      alarmSound.loop = false;
      alarmSound.play();
      playAlarm = false;

      bossTrack.play();
      boss = new Enemy(
        globalConst.vacuumSpriteWidth / globalConst.cols,
        globalConst.vacuumSpriteHeight,
        `./images/vacuumSprite2.png`,
        globalConst.bossPoints,
        globalConst.bossHealth,
        globalConst.bossSpeed
      );
      boss.chooseSpawnPoint(canvas.width, canvas.height);
    }
    drawBoss();
    // to reuse function of collisions, we pass the boss
    //object as a one item array
    detectCollitions(hairballs, [boss]);
    if (boss.health <= 0) winGame();
  }
  // hud canvas
  ctxHud.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  fishBar.forEach((fish, index) => {
    // position fish in canvas
    fish.x = index * fish.width + 15;
    fish.y = hudCanvas.height / 2;
    fish.draw(ctxHud);
  });
  // draw the total score
  ctxHud.font = "25px Chicle";
  // gradient for text
  let gradient = ctxHud.createLinearGradient(580, 0, hudCanvas.width, 0);
  gradient.addColorStop("0", "#b35c05");
  gradient.addColorStop("0.5", "#f0750f");
  gradient.addColorStop("1.0", "#f09537");
  ctxHud.fillStyle = gradient;
  ctxHud.fillText(`SCORE: ${score}`, 580, 80);

  if (cat.health <= 0) gameOver();
}

window.onload = function() {
  document.getElementById("startBtn").addEventListener("click", event => {
    // prepare objects for canvas
    fillHealthBar(cat, fishBar);
    gameTrack.play();
    // disable button to avoid restart of the game
    document.getElementById("startBtn").disabled = true;
    start();
  });

  // add event listener to keys
  document.addEventListener("keydown", event => {
    if (event.keyCode === 82 && interval === undefined) {
      restart();
    }
    if (interval === undefined) return;
    cat.direction = keylogger.keyPress(event.keyCode);
    // orientation is used to give a direction to the hairballs
    if (cat.direction) cat.orientation = cat.direction;
    // space bar doesn't work when arrow up and arrow left are being pressed? odd...
    // used other key instead
    if (event.keyCode === globalConst.shootKey) {
      let audioShoot = new Audio();
      audioShoot.src = "./sounds/shot.wav";
      audioShoot.play();
      let hairball = new HairBall(
        globalConst.hairballWidth,
        globalConst.hairballHeight,
        "./images/Hairball2.png",
        cat.orientation,
        globalConst.bulletDamage
      );
      hairball.alignCenter(cat);
      hairballs.push(hairball);
    }
  });

  document.addEventListener("keyup", event => {
    if (interval === undefined) return;
    cat.direction = keylogger.keyRelease(event.keyCode);
    if (cat.direction) cat.orientation = cat.direction;
  });
};
