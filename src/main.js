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
    chooseFrame(cat);
    cat.draw(ctx);
    if (cat.direction)
      cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
    generateEnemies();
    drawHairballs();
    drawEnemies();
  }, 1000 / 60);

  // add event listener to keys
  document.addEventListener("keydown", event => {
    console.log(event.keyCode)
    cat.direction = keylogger.keyPress(event.keyCode);
    if (cat.direction) cat.orientation = cat.direction;
    // space bar doesn't work when arrow up and arrow left are bien pressed?
    if (event.keyCode === 17){
      let hairball = new HairBall(32,32,"./images/Hairball.png", cat.orientation);
      hairball.alignCenter(cat);
      hairballs.push(hairball);
    }
  });
  
  document.addEventListener("keyup", event => {
    cat.direction = keylogger.keyRelease(event.keyCode);
    if (cat.direction) cat.orientation = cat.direction;
  });

};

function chooseFrame(cat) {
  // update sprite to draw, adjusting width and height accordingly
  switch (cat.direction) {
    case "E":
    case "NE":
    case "SE":
      cat.image.src = `./images/${catChosen}-right-sprite.png`;
      cat.width = globalConst.leftSpriteWidth / globalConst.cols;
      cat.height = globalConst.leftSpriteHeight;
      break;
    case "W":
    case "NW":
    case "SW":
      cat.image.src = `./images/${catChosen}-left-sprite.png`;
      cat.width = globalConst.rightSpriteWidth / globalConst.cols;
      cat.height = globalConst.rightSpriteHeight;
      break;
    case "N":
      cat.image.src = `./images/${catChosen}-up-sprite.png`;
      cat.width = globalConst.upSpriteWidth / globalConst.cols;
      cat.height = globalConst.upSpriteHeight;
      break;
    case "S":
      cat.image.src = `./images/${catChosen}-idle-sprite.png`;
      cat.width = globalConst.idleSpriteWidth / globalConst.cols;
      cat.height = globalConst.idleSpriteHeight;
      break;

    default:
      break;
  }

  cat.updateFrame(frames);
}

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

function drawEnemies(){
  enemies.forEach((enemy, index) => {
    enemy.updateFrame(frames);
    enemy.draw(ctx);
    enemy.move(globalConst.enemySpeed, 0, canvas.width, canvas.height, 0, cat);
  });
}

function drawHairballs(){
  hairballs.forEach((hairball, index) => {
    hairball.draw(ctx);
    hairball.move(globalConst.bulletSpeed);
  });
}