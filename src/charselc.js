// First canvas
let canvasChar1 = document.getElementById("char-1");
let ctxChar1 = canvasChar1.getContext("2d");
// second canvas
let canvasChar2 = document.getElementById("char-2");
let ctxChar2 = canvasChar2.getContext("2d");

let curFrame = 0;
let frameCount = globalConst.cols;

let cat1 =  new Cat(globalConst.idleSpriteWidth /  globalConst.cols, globalConst.idleSpriteHeight, "./images/cat-1-idle-sprite.png");
let cat2 =  new Cat(globalConst.idleSpriteWidth / globalConst.cols, globalConst.idleSpriteHeight, "./images/cat-2-idle-sprite.png");

window.onload = function() {
  // clear current keys in local storage
  window.localStorage.removeItem("catChosen");
  let interval = setInterval(() => {
    curFrame = ++curFrame % frameCount;
    // draw first cat
    ctxChar1.clearRect(0, 0, canvasChar1.width, canvasChar1.height);
    cat1.updateFrame(curFrame);
    cat1.drawIdle(ctxChar1,curFrame);
    // draw second cat
    ctxChar2.clearRect(0, 0, canvasChar1.width, canvasChar1.height);
    cat2.updateFrame(curFrame);
    cat2.drawIdle(ctxChar2);
  }, 1000/frameCount);

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