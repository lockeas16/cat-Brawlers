const globalConst = {
  // sprite sizes
  idleSpriteWidth: 126,
  idleSpriteHeight: 87,
  leftSpriteWidth: 252,
  leftSpriteHeight: 69,
  rightSpriteWidth: 252,
  rightSpriteHeight: 69,
  upSpriteWidth: 126,
  upSpriteHeight: 72,
  demonSpriteWidth: 132,
  demonSpriteHeight: 46,
  hairballWidth: 16,
  hairballHeight: 16,
  fishWidth: 64,
  fishHeight: 46,
  goImgWidth: 179,
  goImgHeight: 127,
  tryImgWidth: 330,
  tryImgHeight: 28,
  cols: 3,
  // speed and movement properties
  movement: 3,
  enemySpeed: 1,
  bulletSpeed: 4,
  // enemies properties
  demonPoints: 1,
  // cat properties
  catHealth: 5,
  invincibilityTime: 3000, //milliseconds
  // other properties
  animationName: "glow 1s ease-in-out infinite alternate",
  shootKey: 17
};

class Item {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  isTouching(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }
}

class Cat extends Item {
  constructor(width, height, src, health) {
    super(0, 0, width, height);
    this.srcx = 0;
    this.srcy = 0;
    this.image = new Image();
    this.image.src = src;
    this.direction = undefined;
    this.orientation = "S";
    this.health = health;
    this.invincible = false;
    this.wasHit = false;
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
  updateFrame(frames, catChosen) {
    // update sprite to draw, adjusting width and height accordingly
    switch (this.direction) {
      case "E":
      case "NE":
      case "SE":
        this.image.src = `./images/${catChosen}-right-spriteBig.png`;
        this.width = globalConst.leftSpriteWidth / globalConst.cols;
        this.height = globalConst.leftSpriteHeight;
        break;
      case "W":
      case "NW":
      case "SW":
        this.image.src = `./images/${catChosen}-left-spriteBig.png`;
        this.width = globalConst.rightSpriteWidth / globalConst.cols;
        this.height = globalConst.rightSpriteHeight;
        break;
      case "N":
        this.image.src = `./images/${catChosen}-up-spriteBig.png`;
        this.width = globalConst.upSpriteWidth / globalConst.cols;
        this.height = globalConst.upSpriteHeight;
        break;
      case "S":
        this.image.src = `./images/${catChosen}-idle-spriteBig.png`;
        this.width = globalConst.idleSpriteWidth / globalConst.cols;
        this.height = globalConst.idleSpriteHeight;
        break;

      default:
        break;
    }

    // overlay sprite to have visual effect of being damaged
    if (this.wasHit) {
      if (!this.image.src.includes("DMG")) {
        let url = this.image.src;
        this.image.src = url.replace("spriteBig", "spriteBigDMG");
      }
    } else {
      if (this.image.src.includes("DMG")) {
        let url = this.image.src;
        this.image.src = url.replace("spriteBigDMG", "spriteBig");
      }
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
  toggleInvincibility() {
    return (this.invincible = !this.invincible);
  }
  toggleDamage() {
    return (this.wasHit = !this.wasHit);
  }
}

class Enemy extends Item {
  constructor(width, height, src, points) {
    super(0, 0, width, height);
    this.srcx = 0;
    this.srcy = 0;
    this.image = new Image();
    this.image.src = src;
    this.points = points;
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
    let { x, y, width, height } = target;
    let xTargetCenter = x + width / 2 - this.width / 2;
    let yTargetCenter = y + height / 2 - this.height / 2;
    if (this.x < xTargetCenter) this.moveRight(mov, boundRight);
    if (this.x > xTargetCenter) this.moveLeft(mov, boundLeft);
    if (this.y < yTargetCenter) this.moveDown(mov, boundBottom);
    if (this.y > yTargetCenter) this.moveUp(mov, boundTop);
  }
  chooseSpawnPoint(boundRight,boundBottom) {
    switch (randomNum(4)) {
      // top left point
      case 0:
        this.x = -this.width;
        this.y = -this.height;
        break;
      // top right spawn point
      case 1:
        this.x = boundRight + this.width;
        this.y = -this.height;
        break;
      // bottom right spawn point
      case 2:
        this.x = boundRight + this.width;
        this.y = boundBottom + this.height;
        break;
      // bottom left spawn point
      case 3:
        this.x = -this.width;
        this.y = boundBottom + this.height;
        break;
  
      default:
        break;
    }
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
        this.x = x + width / 2 - this.width / 2;
        this.y = y - this.height;
        break;
      case "S":
        this.x = x + width / 2 - this.width / 2;
        this.y = y + height;
        break;
      case "E":
      case "NE":
      case "SE":
        this.x = x + width;
        this.y = y + height / 2;
        break;
      case "W":
      case "NW":
      case "SW":
        this.x = x - this.width;
        this.y = y + height / 2;
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

class Fish extends Item {
  constructor(width, height, src) {
    super(0, 0, width, height);
    this.image = new Image();
    this.image.src = src;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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

function randomNum(max, min="0") {
  return Math.floor(Math.random() * (max - min) + min);
}