import {
  BoundaryConfig,
  CharacterConfig,
  FrameConfig,
  HouseConfig,
  Position,
  SpriteConfig,
} from "@/types/classes";
import gsap from "gsap";

export class Sprite {
  position: Position;
  velocity?: Position;
  image: HTMLImageElement;
  frames: FrameConfig;
  sprites?: any;
  animate: boolean;
  rotation: number;
  scale: number;
  opacity: number = 1;
  width: number = 0;
  height: number = 0;

  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
  }: SpriteConfig) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.sprites = sprites;
    this.animate = animate;
    this.rotation = rotation;
    this.scale = scale;

    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale;
      this.height = this.image.height * this.scale;
    };
  }

  faint(): void {
    const blinkTimeline = gsap.timeline();

    blinkTimeline
      .to(this, { opacity: 0, duration: 0.1, repeat: 4, yoyo: true }) // Blink for ~2 seconds
      .to(this, { opacity: 0, duration: 0.5 }); // Finally fade out completely
  }

  draw(c: CanvasRenderingContext2D): void {
    c.save();
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    c.globalAlpha = this.opacity;

    const crop = {
      position: {
        x: this.frames.val! * (this.width / this.scale),
        y: 0,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    );

    c.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed!++;
    }

    if (this.frames.elapsed! % this.frames.hold === 0) {
      if (this.frames.val! < this.frames.max - 1) this.frames.val!++;
      else this.frames.val = 0;
    }
  }
}

export class Boundary {
  static width: number = 36;
  static height: number = 36;
  position: Position;

  constructor({ position }: BoundaryConfig) {
    this.position = position;
    this.width = 36;
    this.height = 36;
    this.type = "Boundary";
  }

  draw(c: CanvasRenderingContext2D): void {
    c.fillStyle = "rgba(255, 0, 0, 1)";
    c.fillRect(
      this.position.x,
      this.position.y,
      Boundary.width,
      Boundary.height
    );
  }
}

export class House {
  static width: number = 36;
  static height: number = 36;
  position: Position;
  dialogue: string[];
  dialogueIndex: number = 0;

  constructor({ position, dialogue = [""] }: HouseConfig) {
    this.position = position;
    this.dialogue = dialogue;
  }

  draw(c: CanvasRenderingContext2D): void {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, House.width, House.height);
  }
}

export class Character extends Sprite {
  dialogue: string[];
  dialogueIndex: number = 0;

  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    dialogue = [""],
  }: CharacterConfig) {
    super({
      position,
      velocity,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale,
    });
    this.dialogue = dialogue;
  }
}
