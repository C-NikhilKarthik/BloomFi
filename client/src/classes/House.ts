export class House {
  static width = 36;
  static height = 36;
  position: { x: number; y: number };
  width: number;
  height: number;
  dialogue: string[];
  dialogueIndex: number;
  type: string;

  constructor({
    position,
    dialogue = [""],
  }: {
    position: { x: number; y: number };
    dialogue?: string[];
  }) {
    this.position = position;
    this.width = 36;
    this.height = 36;
    this.dialogue = dialogue;
    this.dialogueIndex = 0;
    this.type = "House";
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "rgba(255, 0, 0, 0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
