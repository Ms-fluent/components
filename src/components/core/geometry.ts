export class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y : number = 0) {
    this.x = x;
    this.y = y;
  }

  add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }

  minus(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y);
  }
}

export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
