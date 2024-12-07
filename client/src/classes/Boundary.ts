export class Boundary {
  static width = 36;
  static height = 36;
  position: { x: number; y: number };
  width: number;
  height: number;
  type: string;

  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    this.width = 36;
    this.height = 36;
    this.type = "Boundary";
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "rgba(255, 0, 0, 0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
