const globalConst = {
  idleSpriteWidth: 42,
  idleSpriteHeight: 29,
  leftSpriteWidth: 84,
  leftSpriteHeight: 23,
  rightSpriteWidth: 84,
  rightSpriteHeight: 23,
  upSpriteWidth: 42,
  upSpriteHeight: 24,
  demonSpriteWidth: 132,
  demonSpriteHeight: 46,
  hairballWidth: 16,
  hairballHeight: 16,
  cols: 3,
  movement: 3,
  enemySpeed: 1,
  bulletSpeed: 4
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
    this.direction = undefined;
    this.orientation = "S";
  }

  draw(ctx) {
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
  updateFrame(frames, catChosen) {
    // update sprite to draw, adjusting width and height accordingly
    switch (this.direction) {
      case "E":
      case "NE":
      case "SE":
        this.image.src = `./images/${catChosen}-right-sprite.png`;
        this.width = globalConst.leftSpriteWidth / globalConst.cols;
        this.height = globalConst.leftSpriteHeight;
        break;
      case "W":
      case "NW":
      case "SW":
        this.image.src = `./images/${catChosen}-left-sprite.png`;
        this.width = globalConst.rightSpriteWidth / globalConst.cols;
        this.height = globalConst.rightSpriteHeight;
        break;
      case "N":
        this.image.src = `./images/${catChosen}-up-sprite.png`;
        this.width = globalConst.upSpriteWidth / globalConst.cols;
        this.height = globalConst.upSpriteHeight;
        break;
      case "S":
        this.image.src = `./images/${catChosen}-idle-sprite.png`;
        this.width = globalConst.idleSpriteWidth / globalConst.cols;
        this.height = globalConst.idleSpriteHeight;
        break;

      default:
        break;
    }

    if (frames % 60 <= 20) {
      this.srcx = 0 * this.width;
    }
    if (frames % 60 > 20 && frames % 60 <= 40) {
      this.srcx = 1 * this.width;
    }
    if (frames % 60 > 40) {
      this.srcx = 2 * this.width;
    }
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

class Enemy extends Item {
  constructor(width, height, src) {
    super(0, 0, width, height);
    this.srcx = 0;
    this.srcy = 0;
    this.image = new Image();
    this.image.src = src;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.srcx,
      this.srcy,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  updateFrame(frames) {
    if (frames % 60 <= 20) {
      this.srcx = 0 * this.width;
    }
    if (frames % 60 > 20 && frames % 60 <= 40) {
      this.srcx = 1 * this.width;
    }
    if (frames % 60 > 40) {
      this.srcx = 2 * this.width;
    }
  }
  moveDown(mov, boundarie) {
    if (this.y + mov + this.height < boundarie) this.y += mov;
  }
  moveUp(mov, boundarie) {
    if (this.y - mov > boundarie) this.y -= mov;
  }
  moveRight(mov, boundarie) {
    if (this.x + mov + this.width < boundarie) this.x += mov;
  }
  moveLeft(mov, boundarie) {
    if (this.x - mov > boundarie) this.x -= mov;
  }
  move(mov, boundTop, boundRight, boundBottom, boundLeft, target) {
    let { x, y } = target;
    if (this.x < x) this.moveRight(mov, boundRight);
    if (this.x > x) this.moveLeft(mov, boundLeft);
    if (this.y < y) this.moveDown(mov, boundBottom);
    if (this.y > y) this.moveUp(mov, boundTop);
  }
}

class HairBall extends Item {
  constructor(width, height, src, direction) {
    super(0, 0, width, height);
    this.srcx = 0;
    this.srcy = 0;
    this.image = new Image();
    this.image.src = src;
    this.direction = direction;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.srcx,
      this.srcy,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  alignCenter(cat) {
    let { x, y, width, height, orientation } = cat;
    switch (orientation) {
      case "N":
        this.x = x + width / 2;
        this.y = y - this.height;
        break;
      case "S":
        this.x = x + width / 2;
        this.y = y + height * 3;
        break;
      case "E":
      case "NE":
      case "SE":
        this.x = x + width * 3;
        this.y = y + height;
        break;
      case "W":
      case "NW":
      case "SW":
        this.x = x - this.width;
        this.y = y + height;
        break;
      default:
        break;
    }
  }
  move(speed) {
    switch (this.direction) {
      case "N":
        this.y -= speed;
        break;
      case "S":
        this.y += speed;
        break;
      case "E":
      case "NE":
      case "SE":
        this.x += speed;
        break;
      case "W":
      case "NW":
      case "SW":
        this.x -= speed;
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

  calculateDirection() {
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
