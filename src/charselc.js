// First canvas
let canvasChar1 = document.getElementById("char-1");
let ctxChar1 = canvasChar1.getContext("2d");
// second canvas
let canvasChar2 = document.getElementById("char-2");
let ctxChar2 = canvasChar2.getContext("2d");

let frames = 0;
let spriteWidth = 384;
let spriteHeight = 256;
let rows = 8;
let cols = 12;
let curFrame = 0;
let frameCount = 3;

let cat1 =  new Cat(spriteWidth / cols, spriteHeight / rows, "./images/cat-1-idle-sprite.png");
let cat2 =  new Cat(spriteWidth / cols, spriteHeight / rows, "./images/cat-2-idle-sprite.png");

window.onload = function() {
  let interval = setInterval(() => {
    curFrame = ++curFrame % frameCount;
    ctxChar1.clearRect(0, 0, canvasChar1.width, canvasChar1.height);
    cat1.drawIdle(ctxChar1,curFrame);
    ctxChar2.clearRect(0, 0, canvasChar1.width, canvasChar1.height);
    cat2.drawIdle(ctxChar2,curFrame);
  }, 1000/3);

  // add event listener to anchor
  document.getElementById("cat-1").addEventListener("click",function () {
    // save choice in local storage
    window.localStorage.setItem("catChosen","cat-1");
  });
  document.getElementById("cat-2").addEventListener("click",function () {
    // save choice in local storage
    window.localStorage.setItem("catChosen","cat-2");
  });
};