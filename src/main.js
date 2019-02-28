// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
let frames = 0;
let interval = 0;
let enemies = [];
let hairballs = [];

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
let cat = new Cat(
  globalConst.idleSpriteWidth / globalConst.cols,
  globalConst.idleSpriteHeight,
  `./images/${catChosen}-idle-sprite.png`
);
// center cat in canvas
// divide by 2 total width and total height of cat (the original sprite is multiplied by 3)
cat.x = canvas.width / 2 - (cat.width * 3) / 2;
cat.y = canvas.height / 2 - (cat.height * 3) / 2;

let fondo = new Background(canvas.width, canvas.height, "./images/floor-1.jpg");
let keylogger = new keyLogger();

window.onload = function() {
  interval = setInterval(() => {
    frames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fondo.draw(ctx);
    cat.updateFrame(frames, catChosen);
    cat.draw(ctx);
    if (cat.direction)
      cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
    generateEnemies();
    drawHairballs();
    drawEnemies();
  }, 1000 / 60);

  // add event listener to keys
  document.addEventListener("keydown", event => {
    cat.direction = keylogger.keyPress(event.keyCode);
    if (cat.direction) cat.orientation = cat.direction;
    // space bar doesn't work when arrow up and arrow left are being pressed? odd...
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

function generateEnemies() {
  if (!(frames % 60 === 0)) return;
  let enemy = new Enemy(
    globalConst.demonSpriteWidth / globalConst.cols,
    globalConst.demonSpriteHeight,
    `./images/demon-white-sprite.png`,
    cat
  );
  enemies.push(enemy);
}

function drawEnemies() {
  enemies.forEach((enemy, index) => {
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
