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
    this.direction = "S";
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
  move(mov, boundTop, boundRight, boundBottom, boundLeft) {
    switch (this.direction) {
      case "N":
        this.moveUp(mov, boundTop);
        break;

      case "E":
        this.moveRight(mov, boundRight);
        break;

      case "S":
        this.moveDown(mov, boundBottom);
        break;

      case "W":
        this.moveLeft(mov, boundLeft);
        break;

      case "NW":
        this.moveUp(mov, boundTop);
        this.moveLeft(mov, boundLeft);
        break;

      case "NE":
        this.moveUp(mov, boundTop);
        this.moveRight(mov, boundRight);
        break;

      case "SW":
        this.moveDown(mov, boundBottom);
        this.moveLeft(mov, boundLeft);
        break;

      case "SE":
        this.moveDown(mov, boundBottom);
        this.moveRight(mov, boundRight);
        break;

      default:
        break;
    }
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

class keyLogger {
  constructor() {
    this.keys = [];
    this.validKeys = {
      // left
      37: true,
      // up
      38: true,
      // right
      39: true,
      // down
      40: true
    };
  }
  // register the key pressed and then returns the direction
  keyPress(key) {
    if (this.validKeys[key]) this.keys[key] = true;
    return this.calculateDirection();
  }
  // unregister the key released and then returns the direction
  keyRelease(key) {
    if (this.validKeys[key]) this.keys[key] = false;
    return this.calculateDirection();
  }

  calculateDirection(){
    if (this.keys[37] && !this.keys[38] && !this.keys[39] && !this.keys[40])
      return "W";
    if (!this.keys[37] && this.keys[38] && !this.keys[39] && !this.keys[40])
      return "N";
    if (!this.keys[37] && !this.keys[38] && this.keys[39] && !this.keys[40])
      return "E";
    if (!this.keys[37] && !this.keys[38] && !this.keys[39] && this.keys[40])
      return "S";
    if (this.keys[38] && this.keys[37]) return "NW";
    if (this.keys[38] && this.keys[39]) return "NE";
    if (this.keys[40] && this.keys[37]) return "SW";
    if (this.keys[40] && this.keys[39]) return "SE";
  }
}
