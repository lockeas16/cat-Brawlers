// World canvas
let canvas = document.getElementById("world");
let ctx = canvas.getContext("2d");
let frames = 0;
// let frameCount = globalConst.cols;

// retrieve chosen cat from local storage
let catChosen = window.localStorage.getItem("catChosen");
// remove key from local storage
// window.localStorage.removeItem("catChosen");
let cat;

if (catChosen === "cat-1"){
  cat = new Cat(globalConst.idleSpriteWidth /  globalConst.cols, globalConst.idleSpriteHeight, "./images/cat-1-idle-sprite.png");
}
if (catChosen === "cat-2"){
  cat = new Cat(globalConst.idleSpriteWidth /  globalConst.cols, globalConst.idleSpriteHeight, "./images/cat-2-idle-sprite.png");
}

let fondo = new Background(canvas.width, canvas.height, "./images/floor-1.jpg");

window.onload = function() {
  let interval = setInterval(() => {
    frames++;
    // frameCount = frames % 60;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    fondo.draw(ctx);
    chooseFrame(cat);
    cat.drawIdle(ctx);
  }, 1000/60);

  // add event listener to keys
  document.addEventListener("keydown",event => {
    switch (event.keyCode) {
      // ArrowUp
      case 38:
        cat.moveUp(globalConst.movement,0)
        break;
      // Arrow Down
      case 40:
        cat.moveDown(globalConst.movement,canvas.height);
        break;
      // Arrow Right
      case 39:
        cat.moveRight(globalConst.movement,canvas.width);
        break;
      // Arrow Left
      case 37:
        cat.moveLeft(globalConst.movement,0);
        break;
    
      default:
        break;
    }
  })
};

function chooseFrame(cat){
  if (frames % 33 === 0){
    cat.updateFrame(0);
  }
  if (frames % 66 === 0){
    cat.updateFrame(1);
  }
  if (frames % 100 === 0){
    cat.updateFrame(2);
  }
}