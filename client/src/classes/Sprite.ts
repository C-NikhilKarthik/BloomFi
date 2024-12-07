import { gsap } from "gsap";

export class Sprite {
  position: { x: number; y: number };
  image: HTMLImageElement;
  frames: { max: number; hold: number; val: number; elapsed: number };
  animate: boolean;
  sprites?: { [key: string]: HTMLImageElement };
  width: number;
  height: number;
  opacity: number;
  rotation: number;
  scale: number;

  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10, val: 0, elapsed: 0 },
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
  }: {
    position: { x: number; y: number };
    velocity?: { x: number; y: number };
    image: HTMLImageElement;
    frames?: { max: number; hold: number; val?: number; elapsed?: number };
    sprites?: { [key: string]: HTMLImageElement };
    animate?: boolean;
    rotation?: number;
    scale?: number;
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * scale;
      this.height = this.image.height * scale;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.scale = scale;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    context.globalAlpha = this.opacity;

    const crop = {
      position: {
        x: this.frames.val * (this.width / this.scale),
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

    context.drawImage(
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

    context.restore();

    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  faint() {
    gsap
      .timeline()
      .to(this, { opacity: 0, duration: 0.1, repeat: 4, yoyo: true })
      .to(this, { opacity: 0, duration: 0.5 });
  }
}
