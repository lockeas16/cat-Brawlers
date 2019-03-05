// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
// hud canvas
let hudCanvas = document.getElementById("hud");
let ctxHud = hudCanvas.getContext("2d");

let frames = 0;
let interval = undefined;
let enemies = [];
let hairballs = [];
let fishBar = [];
let score = 0;

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
let cat = new Cat(
  globalConst.idleSpriteWidth / globalConst.cols,
  globalConst.idleSpriteHeight,
  `./images/${catChosen}-idle-spriteBig.png`,
  globalConst.catHealth
);
// center cat in canvas
// divide by 2 total width and total height of cat
cat.x = canvas.width / 2 - cat.width / 2;
cat.y = canvas.height / 2 - cat.height / 2;

let fondo = new Background(
  canvas.width,
  canvas.height,
  "./images/gameBackground.png"
);
let keylogger = new keyLogger();

function generateEnemies() {
  if (!(frames % 60 === 0)) return;
  let enemy = new Enemy(
    globalConst.demonSpriteWidth / globalConst.cols,
    globalConst.demonSpriteHeight,
    `./images/demon-white-sprite.png`,
    globalConst.demonPoints
  );
  enemy.chooseSpawnPoint(canvas.width, canvas.height);
  enemies.push(enemy);
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (cat.isTouching(enemy) && !cat.invincible) {
      cat.health--;
      cat.toggleDamage();
      fishBar.shift();
      if (cat.health > 0) {
        cat.toggleInvincibility();
        // fire a timeout to shift invincibility
        setTimeout(() => {
          cat.toggleInvincibility();
          cat.toggleDamage();
        }, globalConst.invincibilityTime);
      }
    }
    enemy.updateFrame(frames);
    enemy.draw(ctx);
    enemy.move(globalConst.enemySpeed, 0, canvas.width, canvas.height, 0, cat);
  });
}

function drawHairballs() {
  hairballs.forEach((hairball, index) => {
    if (
      hairball.x > canvas.width ||
      hairball.x < 0 ||
      hairball.y > canvas.height ||
      hairball.y < 0
    ) {
      return hairballs.splice(index, 1);
    }
    hairball.draw(ctx);
    hairball.move(globalConst.bulletSpeed);
  });
}

function detectCollitions(bullets, enemies) {
  enemies.forEach((enemy, indexEnemy) => {
    bullets.forEach((bullet, indexBullet) => {
      if (bullet.isTouching(enemy)) {
        score += enemy.points;
        bullets.splice(indexBullet, 1);
        enemies.splice(indexEnemy, 1);
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

function start() {
  interval = setInterval(update, 1000 / 60);
}

function restart() {
  if (interval !== undefined) return;
  frames = 0;
  enemies = [];
  hairballs = [];
  fishBar = [];
  score = 0;
  interval = undefined;
  cat = new Cat(
    globalConst.idleSpriteWidth / globalConst.cols,
    globalConst.idleSpriteHeight,
    `./images/${catChosen}-idle-spriteBig.png`,
    globalConst.catHealth
  );
  // center cat in canvas
  // divide by 2 total width and total height of cat
  cat.x = canvas.width / 2 - cat.width / 2;
  cat.y = canvas.height / 2 - cat.height / 2;
  for (let index = 0; index < cat.health; index++) {
    fishBar.push(
      new Fish(
        globalConst.fishWidth,
        globalConst.fishHeight,
        "./images/fish.png"
      )
    );
  }
  start();
}

function update() {
  frames++;
  // canvas world
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fondo.draw(ctx);
  cat.updateFrame(frames, catChosen);
  cat.draw(ctx);
  // move cat if it has an active direction
  if (cat.direction)
    cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
  detectCollitions(hairballs, enemies);
  generateEnemies();
  drawHairballs();
  drawEnemies();

  // hud canvas
  ctxHud.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
  fishBar.forEach((fish, index) => {
    fish.x = index * fish.width + 15;
    fish.y = hudCanvas.height / 2;
    fish.draw(ctxHud);
  });
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
    // hide instructions and start game
    document.getElementsByTagName("section")[1].style.display = "none";
    // show canvas
    document.getElementsByClassName("game-cont")[0].style.display = "flex";
    // prepare objects for canvas
    for (let index = 0; index < cat.health; index++) {
      fishBar.push(
        new Fish(
          globalConst.fishWidth,
          globalConst.fishHeight,
          "./images/fish.png"
        )
      );
    }
    let audio = new Audio();
    audio.src = "./sounds/Cyborg Ninja.mp3";
    audio.loop = true;
    audio.volume = 0.6;
    // audio.play();
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
        cat.orientation
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
