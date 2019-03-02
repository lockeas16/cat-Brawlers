// canvas
let canvas = document.getElementById("landing");
let ctx = canvas.getContext("2d");
let interval = undefined;
let fondo = new Image();
fondo.src = "./images/blackcatBack.png";
let fondo2 = new Image();
fondo2.src = "./images/catsBackground2.png";
let x = 0;

function start() {
  interval = setInterval(update, 1000 / 60);
}

function update() {
  frames++;
  x -= 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (x < -canvas.width) x = 0;
  ctx.drawImage(fondo, x, 0, canvas.width, canvas.height);
  ctx.drawImage(fondo, x + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(fondo2, 0, 300, canvas.width, canvas.height);
}

window.onload = function() {
  start();
  document.getElementById("pawStart").addEventListener("click",()=>{
    let audio = new Audio();
    audio.src = "./sounds/Le Grand Chase.mp3";
    audio.loop = true;
    audio.play();
    // hide landing section
    document.getElementsByTagName("section")[2].style.display = "none";
    // show starter section
    document.getElementsByTagName("section")[0].style.display = "flex";
  })
};
