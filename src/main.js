// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
let scoreNode = document.getElementById("score");
let frames = 0;
let interval = 0;
let enemies = [];
let hairballs = [];
let score = 0;

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
let cat = new Cat(
  globalConst.idleSpriteWidth / globalConst.cols,
  globalConst.idleSpriteHeight,
  `./images/${catChosen}-idle-spriteBig.png`
);
// center cat in canvas
// divide by 2 total width and total height of cat
cat.x = canvas.width / 2 - cat.width / 2;
cat.y = canvas.height / 2 - cat.height / 2;

let fondo = new Background(canvas.width, canvas.height, "./images/floor-1.jpg");
let keylogger = new keyLogger();

function generateEnemies() {
  if (!(frames % 60 === 0)) return;
  let enemy = new Enemy(
    globalConst.demonSpriteWidth / globalConst.cols,
    globalConst.demonSpriteHeight,
    `./images/demon-white-sprite.png`,
    globalConst.demonPoints
  );
  enemies.push(enemy);
}

function drawEnemies() {
  enemies.forEach(enemy => {
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
        scoreNode.innerText = score;
        bullets.splice(indexBullet, 1);
        enemies.splice(indexEnemy, 1);
      }
    });
  });
}

window.onload = function() {
  interval = setInterval(() => {
    frames++;
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
  }, 1000 / 60);

  // add event listener to keys
  document.addEventListener("keydown", event => {
    cat.direction = keylogger.keyPress(event.keyCode);
    // orientation is used to give a direction to the hairballs
    if (cat.direction) cat.orientation = cat.direction;
    // space bar doesn't work when arrow up and arrow left are being pressed? odd...
    // used ctrl key instead
    if (event.keyCode === 17) {
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
    cat.direction = keylogger.keyRelease(event.keyCode);
    if (cat.direction) cat.orientation = cat.direction;
  });
};
