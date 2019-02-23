const globalConst = {
  idleSpriteWidth: 42,
  idleSpriteHeight: 29,
  leftSpriteWidth: 84,
  leftSpriteHeight: 23,
  rightSpriteWidth: 84,
  rightSpriteHeight: 23,
  downSpriteWidth: 42,
  downSpriteHeight: 23,
  cols: 3,
  movement: 3
};

class Item {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Cat extends Item {
  constructor(width, height, src) {
    super(0, 0, width, height);
    this.srcx = 0;
    this.srcy = 0;
    this.image = new Image();
    this.image.src = src;
  }

  drawIdle(ctx) {
    // this.srcx = curFrame * this.width;
    ctx.drawImage(
      this.image,
      this.srcx,
      this.srcy,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * 3,
      this.height * 3
    );
  }
  updateFrame(frame) {
    this.srcx = frame * this.width;
  }
  moveDown(mov, boundarie) {
    if (this.y + mov + this.height * 3 < boundarie) this.y += mov;
  }
  moveUp(mov, boundarie) {
    if (this.y - mov > boundarie) this.y -= mov;
  }
  moveRight(mov, boundarie) {
    if (this.x + mov + this.width * 3 < boundarie) this.x += mov;
  }
  moveLeft(mov, boundarie) {
    if (this.x - mov > boundarie) this.x -= mov;
  }
}

class Background extends Item {
  constructor(width, height, src) {
    super(0, 0, width, height);
    this.image = new Image();
    this.image.src = src;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
