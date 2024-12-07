import { useEffect, useRef } from "react";
import { collision } from "@/data/collision";

console.log(collision);
const offset = {
  x: -675,
  y: -1570,
};

class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1 },
  }: {
    position: { x: number; y: number };
    image: HTMLImageElement;
    frames: { max: number };
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
  }

  position: { x: number; y: number };
  image: HTMLImageElement;
  frames: { max: number };

  draw(c: CanvasRenderingContext2D) {
    // c.drawImage(this.image, this.position.x, this.position.y);
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Boundary {
  static width = 36;
  static height = 36;
  constructor({ position }) {
    this.position = position;
    this.width = 36;
    this.height = 36;
  }

  position: { x: number; y: number };
  height: number;
  width: number;

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "rgba(255,0,0,1)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const collisionMap = [];
for (let i = 0; i < collision.length; i += 150) {
  collisionMap.push(collision.slice(i, 150 + i));
}

const boundaries = [];
collisionMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

function rectangularCollision({ reactangle1, rectangle2 }) {
  return (
    reactangle1.position.x + reactangle1.width >= rectangle2.position.x &&
    reactangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    reactangle1.position.y <= rectangle2.height + rectangle2.position.y &&
    reactangle1.position.y + reactangle1.height >= rectangle2.position.y
  );
}

console.log(collisionMap);

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas exists
    const c = canvas.getContext("2d");
    if (!c) return; // Ensure context exists

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load background image
    const backgroundImg = new Image();
    backgroundImg.src = "/GameMap.png";

    const playerImg = new Image();
    playerImg.src = "/playerDown.png";

    const background = new Sprite({
      position: { x: offset.x, y: offset.y },
      image: backgroundImg,
      frames: { max: 1 },
    });

    const player = new Sprite({
      position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
      },
      image: playerImg,
      frames: { max: 4 },
    });

    const keys: Record<string, boolean> = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    let lastKey = "";

    window.addEventListener("keydown", (e) => {
      if (keys[e.key] !== undefined) {
        keys[e.key] = true;
        lastKey = e.key;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (keys[e.key] !== undefined) {
        keys[e.key] = false;
        lastKey = "";
      }
    });

    const testboundary = new Boundary({
      position: {
        x: 600,
        y: 600,
      },
    });

    const movables = [background, ...boundaries];

    function animate() {
      window.requestAnimationFrame(animate);

      // Clear the canvas
      c.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      background.draw(c);
      boundaries.forEach((boundary) => {
        boundary.draw(c);
      });
      // testboundary.draw(c);
      player.draw(c);

      // Draw player sprite
      let moving = true;
      player.moving = false;
      if (keys.w) {
        player.moving = true;
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangularCollision({
              reactangle1: player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y + 3,
                },
              },
            })
          ) {
            moving = false;
            break;
          }
        }

        if (moving)
          movables.forEach((movable) => {
            movable.position.y += 3;
          });
      }

      if (keys.s) {
        player.moving = true;

        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangularCollision({
              reactangle1: player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x,
                  y: boundary.position.y - 3,
                },
              },
            })
          ) {
            moving = false;
            break;
          }
        }

        if (moving)
          movables.forEach((movable) => {
            movable.position.y -= 3;
          });
      }

      if (keys.d) {
        player.moving = true;

        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangularCollision({
              reactangle1: player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x - 3,
                  y: boundary.position.y,
                },
              },
            })
          ) {
            moving = false;
            break;
          }
        }

        if (moving)
          movables.forEach((movable) => {
            movable.position.x -= 3;
          });
      }

      if (keys.a) {
        player.moving = true;

        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            rectangularCollision({
              reactangle1: player,
              rectangle2: {
                ...boundary,
                position: {
                  x: boundary.position.x + 3,
                  y: boundary.position.y,
                },
              },
            })
          ) {
            moving = false;
            break;
          }
        }

        if (moving)
          movables.forEach((movable) => {
            movable.position.x += 3;
          });
      }
    }

    animate();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
