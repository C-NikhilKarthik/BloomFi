import { Sprite } from "./Sprite";

export class Character extends Sprite {
  dialogue: string[];
  dialogueIndex: number;

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
  }: {
    position: { x: number; y: number };
    velocity?: { x: number; y: number };
    image: HTMLImageElement;
    frames?: { max: number; hold: number };
    sprites?: { [key: string]: HTMLImageElement };
    animate?: boolean;
    rotation?: number;
    scale?: number;
    dialogue?: string[];
  }) {
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
    this.dialogueIndex = 0;
  }
}
