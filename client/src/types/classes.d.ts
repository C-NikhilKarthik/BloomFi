export interface Position {
  x: number;
  y: number;
}

export interface FrameConfig {
  max: number;
  hold?: number;
  val?: number;
  elapsed?: number;
}

export interface SpriteConfig {
  position: Position;
  velocity?: Position;
  image: HTMLImageElement;
  frames?: FrameConfig;
  sprites?: any;
  animate?: boolean;
  rotation?: number;
  scale?: number;
}

export interface BoundaryConfig {
  position: Position;
}

export interface HouseConfig {
  position: Position;
  dialogue?: string[];
}

export interface CharacterConfig extends SpriteConfig {
  dialogue?: string[];
}
