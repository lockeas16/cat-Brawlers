// First canvas
let canvasChar1 = document.getElementById("char-1");
let ctxChar1 = canvasChar1.getContext("2d");
// second canvas
let canvasChar2 = document.getElementById("char-2");
let ctxChar2 = canvasChar2.getContext("2d");
let frames=0;

let cat1 = new Cat(
  globalConst.idleSpriteWidth / globalConst.cols,
  globalConst.idleSpriteHeight,
  "./images/cat-1-idle-spriteBig.png",
  globalConst.catHealth
);
let cat2 = new Cat(
  globalConst.idleSpriteWidth / globalConst.cols,
  globalConst.idleSpriteHeight,
  "./images/cat-2-idle-spriteBig.png",
  globalConst.catHealth
);
cat1.x = canvasChar1.width / 2 - cat1.width / 2;
cat1.y = canvasChar1.height / 2 - cat1.height / 2;
cat1.direction = "S";
cat2.x = canvasChar2.width / 2 - cat2.width / 2;
cat2.y = canvasChar2.height / 2 - cat2.height / 2;
cat2.direction = "S";

window.onload = function() {
  // clear current key in local storage
  window.localStorage.removeItem("catChosen");
  let interval = setInterval(() => {
    frames++;
    // draw first cat
    ctxChar1.clearRect(0, 0, canvasChar1.width, canvasChar1.height);
    cat1.updateFrame(frames, "cat-1");
    cat1.draw(ctxChar1);
    // draw second cat
    ctxChar2.clearRect(0, 0, canvasChar2.width, canvasChar2.height);
    cat2.updateFrame(frames, "cat-2");
    cat2.draw(ctxChar2);
  }, 1000 / 60);

  // add event listener to anchor
  document.getElementById("cat-1").addEventListener("click", function() {
    // save choice in local storage
    window.localStorage.setItem("catChosen", "cat-1");
  });
  document.getElementById("cat-2").addEventListener("click", function() {
    // save choice in local storage
    window.localStorage.setItem("catChosen", "cat-2");
  });
};
