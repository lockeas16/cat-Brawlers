// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
let frames = 0;
// let frameCount = globalConst.cols;

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
let cat;

if (catChosen === "cat-1") {
  cat = new Cat(
    globalConst.idleSpriteWidth / globalConst.cols,
    globalConst.idleSpriteHeight,
    "./images/cat-1-idle-sprite.png"
  );
}
if (catChosen === "cat-2") {
  cat = new Cat(
    globalConst.idleSpriteWidth / globalConst.cols,
    globalConst.idleSpriteHeight,
    "./images/cat-2-idle-sprite.png"
  );
}

let fondo = new Background(canvas.width, canvas.height, "./images/floor-1.jpg");
let keylogger = new keyLogger();

window.onload = function() {
  let interval = setInterval(() => {
    frames++;
    // frameCount = frames % 60;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fondo.draw(ctx);
    chooseFrame(cat);
    cat.drawIdle(ctx);
  }, 1000 / 60);

  // add event listener to keys
  document.addEventListener("keydown", event => {
    cat.direction = keylogger.keyPress(event.keyCode);
    cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
  });

  document.addEventListener("keyup", event => {
    cat.direction = keylogger.keyRelease(event.keyCode);
    cat.move(globalConst.movement, 0, canvas.width, canvas.height, 0);
  });
};

function chooseFrame(cat) {
  // update all frames within a second
  if (frames % 60 <= 20) {
    cat.updateFrame(0);
  }
  if (frames % 60 > 20 && frames % 60 <= 40) {
    cat.updateFrame(1);
  }
  if (frames % 60 > 40) {
    cat.updateFrame(2);
  }
}
