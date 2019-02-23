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

  drawIdle(ctx, curFrame) {
    this.srcx = curFrame * this.width;
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
}
